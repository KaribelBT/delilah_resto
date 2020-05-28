CREATE DATABASE delilah_resto;

DROP TABLE IF EXISTS  fop;

CREATE TABLE  fop  (
  id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  name VARCHAR (60) NOT NULL
);

INSERT  INTO  fop  VALUES (1,'EFECTIVO'),(2,'DEBITO'),(3,'CREDITO');

DROP TABLE IF EXISTS  status ;

CREATE TABLE  status  (
   id   INT PRIMARY KEY  NOT NULL AUTO_INCREMENT,
   name   VARCHAR(60) NOT NULL
);

INSERT  INTO  status  VALUES (1,'NUEVO'),(2,'CONFIRMADO'),(3,'PREPARANDO'),(4,'ENVIANDO'),(5,'CANCELADO'),(6,'ENTREGADO');

DROP TABLE IF EXISTS  users ;

CREATE TABLE  users  (
   id   INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
   username   VARCHAR(60) NOT NULL,
   fullname   VARCHAR(60) NOT NULL,
   email   VARCHAR(60) NOT NULL,
   phone   INT  NOT NULL,
   address   VARCHAR(255) NOT NULL,
   password   VARCHAR(60) NOT NULL,
   admin  BOOLEAN NOT NULL,
   enable  BOOLEAN NOT NULL
);

INSERT  INTO  users  VALUES (1,'karibelbt','karibel barco','kbarco@gmail.com',5454545,'asdasd asdasd asdasd','hola',1,1),(2,'usuario','test','testo@gmail.com',5454545,'asdasd asdasd asdasd','hola',0,1);

DROP TABLE IF EXISTS  orders ;

CREATE TABLE  orders  (
   id   INT PRIMARY KEY  NOT NULL AUTO_INCREMENT,
   id_status   INT  NOT NULL,
   create_time  datetime NOT NULL,
   quantity   INT  NOT NULL,
   id_fop   INT  NOT NULL,
   price  FLOAT NOT NULL,
   id_user   INT  NOT NULL,
  KEY  fk_id_status_id  ( id_status ),
  KEY  fk_id_fop_id  ( id_fop ),
  KEY  fk_id_user_id  ( id_user ),
  CONSTRAINT  fk_id_fop_id  FOREIGN KEY ( id_fop ) REFERENCES  fop  ( id ) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT  fk_id_status_id  FOREIGN KEY ( id_status ) REFERENCES  status  ( id ) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT  fk_id_user_id  FOREIGN KEY ( id_user ) REFERENCES  users  ( id ) ON DELETE NO ACTION ON UPDATE NO ACTION
);

INSERT  INTO  orders  VALUES (1,1,'2020-05-20 00:00:00',1,1,425,2);

DROP TABLE IF EXISTS  products ;

CREATE TABLE  products  (
   id   INT PRIMARY KEY  NOT NULL AUTO_INCREMENT,
   name   VARCHAR(60) NOT NULL,
   price  FLOAT NOT NULL,
   img_url   VARCHAR(255) NOT NULL,
   stock   INT  NOT NULL,
   enable  BOOLEAN NOT NULL
);

INSERT  INTO  products  VALUES (1,'bagle de salmon',425,'https://i.pinimg.com/236x/82/1b/0f/821b0ff74c7ee26c4882e954a6f2686e--bagel-sandwich-breakfast-sandwiches.jpg',100,1);

DROP TABLE IF EXISTS  orders_products;

CREATE TABLE  orders_products  (
   id   INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
   id_order   INT  NOT NULL,
   id_product   INT  NOT NULL,
  KEY  id_order  ( id_order ),
  KEY  id_product  ( id_product ),
  CONSTRAINT  orders_products_ibfk_1  FOREIGN KEY ( id_order ) REFERENCES  orders  ( id ) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT  orders_products_ibfk_2  FOREIGN KEY ( id_product ) REFERENCES  products  ( id ) ON DELETE NO ACTION ON UPDATE NO ACTION
);

INSERT  INTO  orders_products  VALUES (1,1,1);