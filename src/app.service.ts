import {
  Injectable,
  BadRequestException,
  StreamableFile,
} from '@nestjs/common';
import { Response } from 'express';
import { createWriteStream, createReadStream, readFileSync } from 'fs';
import { Document, Image } from 'pdfjs';
import * as tmp from 'tmp';
import { loremLong, loremShort } from './lorem';
import { join } from 'path';

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

  async genpdfTable(res: Response) {
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

    const footer = doc.footer();
    footer.pageNumber((curr, total) => `${curr} / ${total}`, {
      textAlign: 'right',
      fontSize: 12,
    });

    doc.header().text('HAS HEADER');

    doc.text(loremLong);

    const table = doc.table({
      widths: [200, 200],
      borderWidth: 1,
    });

    const header = table.header();
    header.cell('Header Left', { textAlign: 'center', padding: 30 });
    header.cell('Header Right', { textAlign: 'center', padding: 30 });

    const rowFirst = table.row();
    rowFirst.cell(loremShort, {
      fontSize: 15,
      padding: 10,
      backgroundColor: 0xdddddd,
    });
    rowFirst.cell('Cell 2', {
      fontSize: 11,
      padding: 10,
      backgroundColor: 0xeeeeee,
    });

    Array(25)
      .fill('List Row ')
      .map((item, idx) => {
        const rowList = table.row();
        rowList.cell(`${item} ${idx + 1}`, {
          fontSize: 15,
          padding: 10,
          backgroundColor: 0xdddddd,
        });
        rowList.cell('Cell 2', {
          fontSize: 11,
          padding: 10,
          backgroundColor: 0xeeeeee,
        });
      });

    const rowEnd = table.row();
    rowEnd.cell('Last row', {
      fontSize: 15,
      padding: 10,
      backgroundColor: 0xdddddd,
    });
    rowEnd.cell('Cell 2', {
      fontSize: 11,
      padding: 10,
      backgroundColor: 0xeeeeee,
    });

    doc.text('Foo');

    await doc.end();

    const file = createReadStream(filePath);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="PdfFile.pdf"`,
    });
    return new StreamableFile(file);
  }

  async genpdfImg(res: Response) {
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

    const jpegImage = readFileSync(join(__dirname, '..', 'pdfjs.jpg'));
    const img = new Image(jpegImage);

    doc.image(img, {
      width: 64,
      align: 'center',
      wrap: false,
      x: 10,
      y: 30,
    });

    doc.text(loremShort);

    doc.image(img);

    doc.image(img, {
      width: 128,
      align: 'left',
    });

    doc.image(img, {
      height: 55,
      align: 'center',
    });

    doc.image(img, {
      width: 128,
      align: 'right',
    });

    doc.text(loremShort);

    await doc.end();

    const file = createReadStream(filePath);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="PdfFile.pdf"`,
    });
    return new StreamableFile(file);
  }

  async genpdfMix(res: Response) {
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

    const jpegImage = readFileSync(join(__dirname, '..', 'pdfjs.jpg'));
    const img = new Image(jpegImage);

    const footer = doc.footer();
    footer.pageNumber((curr, total) => `${curr} / ${total}`, {
      textAlign: 'right',
      fontSize: 12,
    });

    const headerPage = doc.header();
    headerPage.image(img);
    headerPage.text('_', { color: 0xffffff });

    doc.text(loremLong);

    const table = doc.table({
      widths: ['*', '*'],
      borderWidth: 1,
    });

    const header = table.header();
    header.cell('Header Left', {
      textAlign: 'center',
      backgroundColor: 0xdddddd,
      padding: 4,
    });
    header.cell('Header Right', {
      textAlign: 'center',
      backgroundColor: 0xdddddd,
      padding: 4,
    });

    const rowFirst = table.row();
    rowFirst.cell('Test First', {
      padding: 4,
    });
    rowFirst.cell('Cell 2', {
      padding: 4,
    });

    Array(25)
      .fill('List Row ')
      .map((item, idx) => {
        const rowList = table.row();
        rowList.cell(`${item} ${idx + 1}`, {
          padding: 4,
        });
        rowList.cell('Cell 2', {
          padding: 4,
        });
      });

    const rowEnd = table.row();
    rowEnd.cell('Last row', {
      padding: 4,
    });
    rowEnd.cell('Cell 2', {
      padding: 4,
    });

    doc.text('Foo');

    await doc.end();

    const file = createReadStream(filePath);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="PdfFile.pdf"`,
    });
    return new StreamableFile(file);
  }
}
