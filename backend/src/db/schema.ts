import {pgTable, text, timestamp, uuid} from "drizzle-orm/pg-core";
import {desc, relations} from "drizzle-orm";

export const users = pgTable("users", {
    id: text("id").primaryKey(),
    email: text("email").notNull().unique(),
    name: text("name"),
    imageUrl: text("image_url"),
    createdAt: timestamp("created_at",{mode: "date"}).notNull().defaultNow(),
    updatedAt: timestamp("updated_at",{mode: "date"}).notNull().defaultNow().$onUpdate(()=> new Date()), 
});

export const products = pgTable("products", {
    id: uuid("id").defaultRandom().primaryKey(),
    title: text("title").notNull(),
    description: text("description").notNull(),
    imageUrl: text("image_url").notNull(),
    userId: text("user_id")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at",{mode: "date"}).notNull().defaultNow(),
    updatedAt: timestamp("updated_at",{mode: "date"}).notNull().defaultNow().$onUpdate(()=> new Date()), 
});

export const comments = pgTable("comments", {
    id: uuid("id").defaultRandom().primaryKey(),
    content: text("content").notNull(),
    userId: text("user_id")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    productId: uuid("product_id")
        .notNull()
        .references(() => products.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at",{mode: "date"}).notNull().defaultNow(),
});


export const userRelations = relations(users, ({ many }) => ({
    products: many(products), //one-user -> many-products
    comments: many(comments), //one-user -> many-comments
}));

export const productRelations = relations(products, ({ one, many }) => ({
    comments: many(comments), //one-product -> many-comments
    user: one(users, {fields: [products.userId], references: [users.id]}), //many-products -> one-user
    //fields: foreign key in this table, references: primary key in the related table
}));

export const commentsRelations = relations(comments, ({ one }) => ({
    user: one(users, {fields: [comments.userId], references: [users.id]}), //many-comments -> one-user
    product: one(products, {fields: [comments.productId], references: [products.id]}), //many-comments -> one-product
}));

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;

export type Comment = typeof comments.$inferSelect;
export type NewComment = typeof comments.$inferInsert;
