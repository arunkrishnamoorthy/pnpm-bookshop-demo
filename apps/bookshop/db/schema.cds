namespace sap.capire.bookshop;

using { Currency, managed, cuid } from '@sap/cds/common';

entity Books : managed, cuid {
  title  : localized String(111);
  descr  : localized String(1111);
  author : Association to Authors;
  genre  : Association to Genres;
  stock  : Integer;
  price  : Decimal(9,2);
  currency : Currency;
}

entity Authors : managed, cuid {
  name   : String(111);
  books  : Association to many Books on books.author = $self;
}

entity Genres : cuid {
  name     : String;
  parent   : Association to Genres;
  children : Composition of many Genres on children.parent = $self;
}
