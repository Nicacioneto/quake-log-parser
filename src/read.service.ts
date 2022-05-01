/* eslint-disable @typescript-eslint/no-var-requires */
import { Injectable } from '@nestjs/common';
const fs = require('fs');
const readline = require('readline');

@Injectable()
export class ReadService {
  async read(): Promise<string[]> {
    try {
      const lines = [];

      const file = fs.createReadStream('src/log/qgames.log');

      const reader = readline.createInterface({
        input: file,
        output: null,
        console: false,
      });

      for await (const line of reader) {
        lines.push(line);
      }

      return lines;
    } catch (error) {
      console.log('Error reading file ', error);
      return error;
    }
  }
}
