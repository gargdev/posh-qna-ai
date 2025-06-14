// import { parse } from 'csv-parse';
// import { Readable } from 'stream';

// interface CsvParseResult {
//   emails: string[];
//   errors: string[];
// }

// export const parseSubscribersCsv = (fileStream: Readable): Promise<CsvParseResult> => {
//   return new Promise((resolve, reject) => {
//     const emails: string[] = [];
//     const errors: string[] = [];
//     let isFirstRow = true;

//     const parser = fileStream.pipe(
//       parse({
//         columns: true,
//         trim: true,
//         skip_empty_lines: true,
//       })
//     );

//     interface CsvRow {
//         name?: string;
//         email?: string;
//     }

//     parser.on('data', (row: CsvRow) => {
//         if (isFirstRow) {
//             // Validate headers
//             const headers: string[] = Object.keys(row).map((h: string) => h.toLowerCase());
//             if (headers.length !== 2 || !headers.includes('name') || !headers.includes('email')) {
//                 errors.push('CSV must have "name" and "email" columns');
//                 parser.end();
//                 return;
//             }
//             isFirstRow = false;
//         }

//         const email: string | undefined = row.email?.trim();
//         if (!email) {
//             errors.push('Empty email found');
//             return;
//         }

//         const emailRegex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//         if (!emailRegex.test(email)) {
//             errors.push(`Invalid email: ${email}`);
//             return;
//         }

//         emails.push(email);
//     });

//     parser.on('end', () => {
//       if (emails.length === 0 && errors.length === 0) {
//         errors.push('No valid emails found in CSV');
//       }
//       resolve({ emails, errors });
//     });

//     parser.on('error', (err: Error) => {
//       reject(err);
//     });
//   });
// };

import { parse } from 'csv-parse';
import { Readable } from 'stream';

interface CsvParseResult {
  emails: string[];
  errors: string[];
}

export const parseSubscribersCsv = (fileStream: Readable): Promise<CsvParseResult> => {
  return new Promise((resolve, reject) => {
    const emails: string[] = [];
    const errors: string[] = [];
    let isFirstRow = true;

    const parser = fileStream.pipe(
      parse({
        columns: true,
        trim: true,
        skip_empty_lines: true,
      })
    );

    parser.on('data', (row) => {
      if (isFirstRow) {
        // Debug: Log raw headers
        const rawHeaders = Object.keys(row);
        console.log('🔍 Raw CSV headers:', rawHeaders);

        // Validate headers (case-insensitive)
        const headers = rawHeaders.map(h => h.toLowerCase());
        if (headers.length !== 2 || !headers.includes('name') || !headers.includes('email')) {
          errors.push(`CSV must have "name" and "email" columns (found: ${rawHeaders.join(', ')})`);
          parser.end();
          return;
        }
        isFirstRow = false;
      }

      const email = row.email?.trim();
      if (!email) {
        errors.push('Empty email found');
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        errors.push(`Invalid email: ${email}`);
        return;
      }

      emails.push(email);
    });

    parser.on('end', () => {
      if (emails.length === 0 && errors.length === 0) {
        errors.push('No valid emails found in CSV');
      }
      console.log('🔍 CSV parse result:', { emails, errors });
      resolve({ emails, errors });
    });

    parser.on('error', (err) => {
      console.error('❌ CSV parse error:', err.message);
      reject(err);
    });
  });
};