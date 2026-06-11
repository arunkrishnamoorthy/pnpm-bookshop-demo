module.exports = class CatalogService extends cds.ApplicationService {

  init() {
    const { Books } = this.entities;

    this.after('READ', 'Books', each => {
      if (each.stock > 111) each.title += ` -- 11% discount!`;
    });

    this.on('submitOrder', async req => {
      const { book, quantity } = req.data;
      let b = await SELECT.one.from(Books, book, b => b.stock);
      if (!b) return req.error(404, `Book #${book} doesn't exist`);
      let { stock } = b;
      if (quantity > stock) return req.error(409, `${quantity} exceeds stock for book #${book}`);
      await UPDATE(Books, book).with({ stock: stock -= quantity });
      await this.emit('OrderedBook', { book, quantity, buyer: req.user.id });
      return { stock };
    });

    return super.init();
  }

};
