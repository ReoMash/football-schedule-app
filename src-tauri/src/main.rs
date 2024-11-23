// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use dotenv::dotenv;
use serde::{Deserialize, Serialize};
use std::env;
use std::sync::Arc;
use tauri::command;
use tauri::State;
use tokio::sync::Mutex;
use tokio_postgres::{Client, Error, NoTls};

#[derive(Serialize, Deserialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
struct Team {
    id: i64,
    name: String,
    short_name: String,
    tla: String,
    crest: String,
    area: String,
    league: String,
    club_colors: String,
}

#[derive(Serialize, Debug)]
#[serde(rename_all = "camelCase")]
struct Fixture {
    id: i64,
    competition: String,
    date: String,
    home_team: String,
    away_team: String,
    status: String,
    selected_team: Team,
    is_home: bool,
}

async fn get_connection_client() -> Result<Client, Error> {
    dotenv().ok();

    let db_host: String = env::var("DB_HOST").expect("DB_HOST not set");
    let db_port = env::var("DB_PORT").expect("DB_PORT not set");
    let db_user = env::var("DB_USER").expect("DB_USER not set");
    let db_password = env::var("DB_PASSWORD").expect("DB_PASSWORD not set");
    let db_name = env::var("DB_NAME").expect("DB_NAME not set");

    let connection_string = format!(
        "host={} port={} user={} password={} dbname={}",
        db_host, db_port, db_user, db_password, db_name
    );

    let (client, connection) = tokio_postgres::connect(&connection_string, NoTls).await?;

    tokio::spawn(async move {
        if let Err(e) = connection.await {
            eprintln!("connection error: {}", e);
        }
    });

    Ok(client)
}

#[command]
async fn get_teams(db_client: State<'_, Arc<Mutex<Client>>>) -> Result<Vec<Team>, String> {
    // Open the SQLite connection
    let client = db_client.lock().await;

    // Prepare the SQL statement
    let rows = client
        .query(
            "SELECT id, name, short_name, tla, crest, area, league, club_colors 
                FROM teams
               ",
            &[],
        )
        .await
        .map_err(|e| e.to_string())?;

    // Query the data and map each row to a Team struct
    let teams = rows
        .into_iter()
        .map(|row| Team {
            id: row.get("id"),
            name: row.get("name"),
            short_name: row.get("short_name"),
            tla: row.get("tla"),
            crest: row.get("crest"),
            area: row.get("area"),
            league: row.get("league"),
            club_colors: row.get("club_colors"),
        })
        .collect();

    // Return the result
    Ok(teams)
}

#[command]
async fn get_fixtures(
    db_client: State<'_, Arc<Mutex<Client>>>,
    selected_teams: Vec<Team>,
) -> Result<Vec<Fixture>, String> {
    let client = db_client.lock().await;

    let mut fixtures = Vec::new();

    for team in selected_teams {
        let rows = client
            .query(
                "SELECT id, competition, date, home_team, away_team, status 
                    FROM fixtures 
                    WHERE (home_team = $1 OR away_team = $1) 
                    AND status = 'TIMED'
                    ORDER BY date ASC",
                &[&team.short_name],
            )
            .await
            .map_err(|e| e.to_string())?;

        let team_fixtures: Vec<Fixture> = rows
            .into_iter()
            .map(|row| Fixture {
                id: row.get("id"),
                competition: row.get("competition"),
                date: row.get("date"),
                home_team: row.get("home_team"),
                away_team: row.get("away_team"),
                status: row.get("status"),
                selected_team: team.clone(),
                is_home: team.short_name == row.get::<_, String>("home_team"),
            })
            .collect();

        fixtures.extend(team_fixtures);
    }

    // Return the result
    Ok(fixtures)
}

#[tokio::main]
async fn main() {
    let client = Arc::new(Mutex::new(
        get_connection_client()
            .await
            .expect("error connecting postgres"),
    ));

    tauri::Builder::default()
        .manage(client)
        .invoke_handler(tauri::generate_handler![get_teams, get_fixtures])
        .run(tauri::generate_context!())
        .expect("error while running Tauri application");
}
