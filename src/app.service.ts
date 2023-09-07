import { Injectable } from '@nestjs/common';
import { createWriteStream } from 'fs';
import { Document } from 'pdfjs';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  async genpdf() {
    const doc = new Document({
      font: require('pdfjs/font/Helvetica'),
      padding: 10,
    });
    doc.pipe(createWriteStream('output.pdf'));

    // render something onto the document

    const text = doc.text();
    text
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

    return 'Success!';
  }
}
