CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    login VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    balance NUMERIC(10, 2) NOT NULL DEFAULT 0.00;
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE items (
    id SERIAL PRIMARY KEY,
    market_hash_name VARCHAR(255) NOT NULL,
    currency CHAR(3) NOT NULL,
    suggested_price NUMERIC(10, 2) NOT NULL,
    item_page TEXT NOT NULL,
    market_page TEXT NOT NULL,
    min_price NUMERIC(10, 2) NOT NULL,
    max_price NUMERIC(10, 2) NOT NULL,
    mean_price NUMERIC(10, 2) NOT NULL,
    quantity INTEGER NOT NULL,
    is_tradable BOOLEAN NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);

CREATE TABLE purchases (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    item_id INTEGER NOT NULL REFERENCES items(id) ON DELETE CASCADE,
    purchase_price NUMERIC(10, 2) NOT NULL,
    purchase_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

/*
Я бы добавил индексы на след столбцы, но сейчас они бесполезны при наших данных
CREATE INDEX idx_purchases_user_id ON purchases (user_id);
CREATE INDEX idx_purchases_item_id ON purchases (item_id);
CREATE INDEX idx_items_price_quantity_min_price ON items (suggested_price, quantity, min_price);
CREATE INDEX idx_items_is_tradable ON items (is_tradable);
*/

INSERT INTO items (market_hash_name, currency, suggested_price, item_page, market_page, min_price, max_price, mean_price, median_price, quantity, is_tradable, created_at, updated_at) VALUES
('2020 RMR Legends', 'EUR', 0.17, 'https://skinport.com/item/2020-rmr-legends', 'https://skinport.com/market?item=2020%20RMR%20Legends&cat=Container', 0.23, 5, 0.99, 0.36, 870, False, to_timestamp(1612428014), to_timestamp(1729600814)),
('2021 Community Sticker Capsule', 'EUR', 0.89, 'https://skinport.com/item/2021-community-sticker-capsule', 'https://skinport.com/market?item=2021%20Community%20Sticker%20Capsule&cat=Container', 1.25, 1.56, 1.45, 1.48, 32, False, to_timestamp(1631908649), to_timestamp(1729600814)),
('3rd Commando Company | KSK', 'EUR', 10.91, 'https://skinport.com/item/3rd-commando-company-ksk', 'https://skinport.com/market?item=3rd%20Commando%20Company&cat=Agent&type=KSK', 9.44, 38, 15.08, 12.81, 238, True, to_timestamp(1574830705), to_timestamp(1729600814)),
('Aces High Pin', 'EUR', 7.83, 'https://skinport.com/item/aces-high-pin', 'https://skinport.com/market?item=Aces%20High%20Pin&cat=Collectible', 6.46, 15.99, 7.85, 7.12, 147, True, to_timestamp(1535988254), to_timestamp(1729600814)),
('AK-47 | Aquamarine Revenge (Battle-Scarred)', 'EUR', 18.41, 'https://skinport.com/item/ak-47-aquamarine-revenge-battle-scarred', 'https://skinport.com/market?item=Aquamarine%20Revenge&cat=Rifle&type=AK-47', 18.73, 44.9, 31.21, 30, 3, False, to_timestamp(1535988253), to_timestamp(1729600814));
