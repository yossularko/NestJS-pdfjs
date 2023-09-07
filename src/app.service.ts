import {
  Injectable,
  BadRequestException,
  StreamableFile,
} from '@nestjs/common';
import { Response } from 'express';
import { createWriteStream, createReadStream } from 'fs';
import { Document } from 'pdfjs';
import * as tmp from 'tmp';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  async genpdf(res: Response) {
    const doc = new Document({
      font: require('pdfjs/font/Helvetica'),
      padding: 10,
    });
    const filePath = await new Promise<string>((resolve) => {
      tmp.file(
        {
          discardDescriptor: true,
          prefix: 'MyPdf',
          postfix: '.pdf',
          mode: parseInt('0600', 8),
        },
        async (err, file) => {
          if (err) {
            throw new BadRequestException(err);
          }

          doc.pipe(createWriteStream(file));
          resolve(file);
        },
      );
    });

    // render something onto the document

    const text = doc.text();
    text
      .add('Title' + '\n\n', {
        underline: true,
        fontSize: 18,
        font: require('pdfjs/font/Helvetica-Bold'),
      })
      .add('Regular')
      .add('Bold', { font: require('pdfjs/font/Helvetica-Bold') })
      .add('Regular', { font: require('pdfjs/font/Helvetica') })
      .add('Big', { fontSize: 20 })
      .add('BigBold', {
        fontSize: 20,
        font: require('pdfjs/font/Helvetica-Bold'),
      })
      .add('Red', { color: 0xff0000 })
      .add('Regular')
      // test changing line heights
      .add('\nRegular')
      .add('\nBigger', { fontSize: 40 })
      .add('\nRegular');

    await doc.end();

    const file = createReadStream(filePath);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="PdfFile.pdf"`,
    });
    return new StreamableFile(file);
  }
}
