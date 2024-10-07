const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const { google } = require('googleapis');
const fs = require('fs');


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Serve static files from the public and dist directories
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(express.static(path.join(__dirname, '..', 'dist')));

// Google Sheets Setup
const credentials = JSON.parse(fs.readFileSync('google-credentials.json'));
const sheets = google.sheets('v4');

// Authenticate with Google Sheets API
const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

// Spreadsheet ID and range
const SPREADSHEET_ID = '1tX7oGyoRbAarEqbjBFNefOrGC5FD_Du8zL8yC-RD_O8'; // Replace with your Google Sheet ID
const RANGE = 'games!A:Z'; // Replace with the range you want to access

// API route to get game data
app.get('/api/games', async (req, res) => {
  try {
    const authClient = await auth.getClient();
    const response = await sheets.spreadsheets.values.get({
      auth: authClient,
      spreadsheetId: SPREADSHEET_ID,
      range: RANGE,
    });

    const rows = response.data.values;

    if (rows && rows.length > 1) {
      const headers = rows[0];
      const dataRows = rows.slice(1);

      // Convert rows to JSON objects representing games
      const games = dataRows.map((row) => ({
        gameName: row[0]?.trim() || '',
        militaryBranch: row[1]?.trim() || '',
        era: row[2]?.trim() || '',
        war: row[3]?.trim() || '',
        cdnUnits: row[4]?.trim() || '',
        theatre: row[5]?.trim() || '',
        description: row[6]?.trim() || '',
        url: row[7]?.trim() || '',
        thumbnail: row[8]?.trim() || '',
        publisher: row[9]?.trim() || '',
        developer: row[10]?.trim() || '',
        keyCreative: row[11]?.trim() || '',
        keyCreativeBio: row[12]?.trim() || '',
        releaseYear: row[13]?.trim() || '',
        realismRating: row[14]?.trim() || '',
        screenshotUrl: row[15]?.trim() || '',
        videoUrl: row[16]?.trim() || '',
        battles: row[17]?.split(';').map((battle) => battle.trim()) || [],
        genre: row[18]?.trim() || '',
      }));

      // Extract unique values for the desired columns to create filter options
      const militaryBranch = [...new Set(dataRows.map((row) => row[1]?.trim()).filter(Boolean))];
      const era = [...new Set(dataRows.map((row) => row[2]?.trim()).filter(Boolean))];
      const wars = [...new Set(dataRows.map((row) => row[3]?.trim()).filter(Boolean))];
      const cdnUnits = [...new Set(dataRows.map((row) => row[4]?.trim()).filter(Boolean))];
      const theatre = [...new Set(dataRows.map((row) => row[5]?.trim()).filter(Boolean))];
      const publisher = [...new Set(dataRows.map((row) => row[9]?.trim()).filter(Boolean))];
      const developer = [...new Set(dataRows.map((row) => row[10]?.trim()).filter(Boolean))];
      const keyCreative = [...new Set(dataRows.map((row) => row[11]?.trim()).filter(Boolean))];
      const releaseYear = [...new Set(dataRows.map((row) => row[13]?.trim()).filter(Boolean))];
      const realismRating = [...new Set(dataRows.map((row) => row[14]?.trim()).filter(Boolean))];
      const allBattles = dataRows
        .flatMap((row) => row[17]?.split(';').map((battle) => battle.trim()) || [])
        .filter(Boolean);
      const battles = [...new Set(allBattles)];
      const genre = [...new Set(dataRows.map((row) => row[18]?.trim()).filter(Boolean))];

      // Add default filter values that may not be directly present in the data
      const defaultWars = ['First World War', 'Second World War', 'Korean War', 'Cold War', 'Modern'];
      const warsWithDefaults = [...new Set([...wars, ...defaultWars])];

      res.json({
        games,
        filters: {
          militaryBranch,
          era,
          war: warsWithDefaults,
          cdnUnits,
          theatre,
          publisher,
          developer,
          keyCreative,
          releaseYear,
          realismRating,
          battles,
          genre,
        },
      });
    } else {
      res.status(404).json({ message: 'No data found in the spreadsheet.' });
    }
  } catch (error) {
    console.error('Error retrieving data from Google Sheets:', error);
    res.status(500).json({ message: 'Failed to retrieve data.', error: error.message });
  }
});

// Catch-all handler for SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

