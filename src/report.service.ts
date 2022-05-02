import { Injectable } from '@nestjs/common';

@Injectable()
export class ReportService {
  private games;

  constructor() {
    this.games = [];
  }

  async mainReport(content: string[]) {
    this.games = [];

    let gameIndex = null;

    for (const line of content) {
      if (line.includes('InitGame:')) {
        gameIndex = this.newGame({ total_kills: 0, players: [], kills: {} });
      }

      if (line.includes('ShutdownGame')) {
        this.endGame(gameIndex);
      }

      if (line.includes('Kill:')) {
        this.decodeKill(gameIndex, line);
      }
    }
    return this.games;
  }

  async rankingReport(content: string[], order: string) {
    //Populate games
    this.mainReport(content);

    const ranking = {};

    //Adding kills for each player
    for (const game of this.games) {
      for (const [player, kills] of Object.entries(
        game[Object.keys(game)[0]].kills,
      )) {
        if (!ranking[player]) {
          ranking[player] = 0;
        }
        ranking[player] += kills;
      }
    }

    //Converting Object to array, to perform easy sort
    const sortable = [];

    for (const player in ranking) {
      sortable.push([player, ranking[player]]);
    }

    sortable.sort(function (a, b) {
      if (order == 'DESC') return b[1] - a[1];
      else return a[1] - b[1];
    });

    //After Sort, converting to object again
    const objSorted = {};
    sortable.forEach(function (item) {
      objSorted[item[0]] = item[1];
    });

    return objSorted;
  }

  async deathReport(content: string[]) {
    this.games = [];

    let gameIndex = null;

    for (const line of content) {
      if (line.includes('InitGame:')) {
        gameIndex = this.newGame({ total_kills: 0 });
      }

      if (line.includes('ShutdownGame')) {
        this.endGame(gameIndex);
      }

      if (line.includes('Kill:')) {
        this.decodeDeath(gameIndex, line);
      }
    }
    return this.games;
  }

  private decodeKill(gameIndex: number, line: string) {
    const lineArgs = line.trim().split(' ');
    const killer = lineArgs[5];
    const killed = lineArgs[7];
    this.games[gameIndex][`game_${gameIndex + 1}`].total_kills++;

    // Register Killer
    if (killer !== '<world>') {
      if (
        !this.games[gameIndex][`game_${gameIndex + 1}`].players.includes(killer)
      ) {
        this.games[gameIndex][`game_${gameIndex + 1}`].players.push(killer);
      }
      if (
        !this.games[gameIndex][`game_${gameIndex + 1}`].kills.hasOwnProperty(
          killer,
        )
      ) {
        this.games[gameIndex][`game_${gameIndex + 1}`].kills[killer] = 0;
      }
      this.games[gameIndex][`game_${gameIndex + 1}`].kills[killer]++;
    }

    //Register Killed
    if (
      !this.games[gameIndex][`game_${gameIndex + 1}`].players.includes(killed)
    ) {
      this.games[gameIndex][`game_${gameIndex + 1}`].players.push(killed);
    }

    if (killer === '<world>') {
      if (this.games[gameIndex][`game_${gameIndex + 1}`].kills[killed] > 0) {
        this.games[gameIndex][`game_${gameIndex + 1}`].kills[killed]--;
      }
    }
  }

  private decodeDeath(gameIndex: number, line: string) {
    const lineArgs = line.trim().split(' ');
    const deathCause = lineArgs[9];
    this.games[gameIndex][`game_${gameIndex + 1}`].total_kills++;

    if (!this.games[gameIndex][`game_${gameIndex + 1}`].deathCauses) {
      this.games[gameIndex][`game_${gameIndex + 1}`].deathCauses = {};
    }

    if (
      !this.games[gameIndex][`game_${gameIndex + 1}`].deathCauses[deathCause]
    ) {
      this.games[gameIndex][`game_${gameIndex + 1}`].deathCauses[
        deathCause
      ] = 0;
    }
    this.games[gameIndex][`game_${gameIndex + 1}`].deathCauses[deathCause]++;
  }

  private newGame(params): string {
    const gameCount = this.games.length;

    const gameLength = gameCount + 1;

    const newGame = {};

    newGame[`game_${gameLength}`] = params;

    this.games.push(newGame);

    return gameCount;
  }

  private endGame(gameIndex: number) {
    if (!this.games[gameIndex][`game_${gameIndex + 1}`].total_kills) {
      this.games.splice(gameIndex, 1);
    }
  }
}
