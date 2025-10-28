import { Migration } from '@mikro-orm/migrations';

export class Migration20251028191318 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table \`cocktail\` (\`id\` integer not null primary key autoincrement, \`created_at\` datetime not null, \`updated_at\` datetime not null, \`name\` text not null, \`category\` text not null, \`instructions\` text not null);`);

    this.addSql(`create table \`ingredient\` (\`id\` integer not null primary key autoincrement, \`created_at\` datetime not null, \`updated_at\` datetime not null, \`name\` text not null, \`description\` text not null, \`is_alcoholic\` integer not null, \`image_url\` text not null);`);

    this.addSql(`create table \`cocktail_ingredient\` (\`id\` integer not null primary key autoincrement, \`created_at\` datetime not null, \`updated_at\` datetime not null, \`cocktail_id\` integer not null, \`ingredient_id\` integer not null, \`amount\` text not null, \`unit\` text null, \`order_index\` integer null, constraint \`cocktail_ingredient_cocktail_id_foreign\` foreign key(\`cocktail_id\`) references \`cocktail\`(\`id\`) on update cascade, constraint \`cocktail_ingredient_ingredient_id_foreign\` foreign key(\`ingredient_id\`) references \`ingredient\`(\`id\`) on update cascade);`);
    this.addSql(`create index \`cocktail_ingredient_cocktail_id_index\` on \`cocktail_ingredient\` (\`cocktail_id\`);`);
    this.addSql(`create index \`cocktail_ingredient_ingredient_id_index\` on \`cocktail_ingredient\` (\`ingredient_id\`);`);
  }

}
