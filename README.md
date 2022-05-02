# Description

Quake Log Parser API

# Installation

```bash
$ npm install
```

# Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

```

# Routes
## 1 - Get Log Report

[GET] - http://127.0.0.1:3000/reports

Request Example:

```bash
curl --location --request GET '127.0.0.1:3000/reports'
```

Request Response:
```json
[
    {
        "game_1": {
            "total_kills": 11,
            "players": [
                "Isgalamido",
                "Mocinha"
            ],
            "kills": {
                "Isgalamido": 0
            }
        }
    }
]
```

## 2 - Get Ranking Report

[GET] - http://127.0.0.1:3000/reports/ranking

Query Params: order (ASC, DESC) 

Request Example:

```bash
curl --location --request GET '127.0.0.1:3000/reports/ranking?order=ASC'
```

Request Response:
```json
{
    "Isgalamido": 159,
    "Zeh": 132,
    "Assasinu": 120,
    "Oootsimo": 119,
    "Dono": 78,
    "Chessus": 34,
    "Mal": 21,
    "Maluquinho": 0
}
```

## 3 - Get Deaths Report

[GET] - http://127.0.0.1:3000/reports/deaths

Request Example:

```bash
curl --location --request GET '127.0.0.1:3000/reports/deaths'
```


Request Response:
```json
[
    {
        "game_1": {
            "total_kills": 11,
            "deathCauses": {
                "MOD_TRIGGER_HURT": 7,
                "MOD_ROCKET_SPLASH": 3,
                "MOD_FALLING": 1
            }
        }
    },
]
```