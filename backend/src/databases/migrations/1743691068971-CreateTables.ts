import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTables1743691068971 implements MigrationInterface {
    name = 'CreateTables1743691068971'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."Integrations_provider_enum" AS ENUM('GOOGLE', 'ZOOM', 'MICROSOFT')`);
        await queryRunner.query(`CREATE TYPE "public"."Integrations_app_type_enum" AS ENUM('GOOGLE_MEET', 'ZOOM_MEETING', 'OUTLOOK_CALENDAR')`);
        await queryRunner.query(`CREATE TYPE "public"."Integrations_category_enum" AS ENUM('CALENDAR_AND_VIDEO_CONFERENCING', 'CALENDAR', 'VIDEO_CONFERENCING')`);
        await queryRunner.query(`CREATE TABLE "Integrations" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "provider" "public"."Integrations_provider_enum" NOT NULL, "app_type" "public"."Integrations_app_type_enum" NOT NULL, "category" "public"."Integrations_category_enum" NOT NULL, "access_token" character varying NOT NULL, "refresh_token" character varying, "expiry_date" bigint, "metadata" json NOT NULL, "isConnected" boolean NOT NULL DEFAULT true, "userId" uuid NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_d03a73c576f7ad2f484afe77ec0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."meetings_status_enum" AS ENUM('SCHEDULED', 'CANCELLED')`);
        await queryRunner.query(`CREATE TABLE "meetings" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "guestName" character varying NOT NULL, "guestEmail" character varying NOT NULL, "startTime" TIMESTAMP NOT NULL, "endTime" TIMESTAMP NOT NULL, "additionalInfo" character varying, "meetLink" character varying NOT NULL, "calendarEventId" character varying NOT NULL, "calendarAppType" character varying NOT NULL, "status" "public"."meetings_status_enum" NOT NULL DEFAULT 'SCHEDULED', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, CONSTRAINT "PK_aa73be861afa77eb4ed31f3ed57" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."day_availability_days_enum" AS ENUM('SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY')`);
        await queryRunner.query(`CREATE TABLE "day_availability" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "days" "public"."day_availability_days_enum" NOT NULL, "startTime" TIMESTAMP NOT NULL, "endTime" TIMESTAMP NOT NULL, "isAvailable" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "availabilityId" uuid, CONSTRAINT "PK_dfce5f014ac44f7335585f7d002" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "availability" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "timeGap" integer NOT NULL DEFAULT '30', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_05a8158cf1112294b1c86e7f1d3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "username" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "imageUrl" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "UQ_9c89c8957ed4a21c2ac85eb3824" UNIQUE ("imageUrl"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."events_locationtype_enum" AS ENUM('GOOGLE_MEET', 'ZOOM_MEETING')`);
        await queryRunner.query(`CREATE TABLE "events" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "description" character varying, "slug" character varying NOT NULL, "isPrivate" boolean NOT NULL DEFAULT false, "locationType" "public"."events_locationtype_enum" NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, CONSTRAINT "PK_40731c7151fe4be3116e45ddf73" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "Integrations" ADD CONSTRAINT "FK_34079ab87167ad6b35319bc3ae2" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "meetings" ADD CONSTRAINT "FK_4b70ab8832f1d7f9a7387d14307" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "day_availability" ADD CONSTRAINT "FK_6cf863b682dbf962dec56b3fb37" FOREIGN KEY ("availabilityId") REFERENCES "availability"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "events" ADD CONSTRAINT "FK_9929fa8516afa13f87b41abb263" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "events" DROP CONSTRAINT "FK_9929fa8516afa13f87b41abb263"`);
        await queryRunner.query(`ALTER TABLE "day_availability" DROP CONSTRAINT "FK_6cf863b682dbf962dec56b3fb37"`);
        await queryRunner.query(`ALTER TABLE "meetings" DROP CONSTRAINT "FK_4b70ab8832f1d7f9a7387d14307"`);
        await queryRunner.query(`ALTER TABLE "Integrations" DROP CONSTRAINT "FK_34079ab87167ad6b35319bc3ae2"`);
        await queryRunner.query(`DROP TABLE "events"`);
        await queryRunner.query(`DROP TYPE "public"."events_locationtype_enum"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "availability"`);
        await queryRunner.query(`DROP TABLE "day_availability"`);
        await queryRunner.query(`DROP TYPE "public"."day_availability_days_enum"`);
        await queryRunner.query(`DROP TABLE "meetings"`);
        await queryRunner.query(`DROP TYPE "public"."meetings_status_enum"`);
        await queryRunner.query(`DROP TABLE "Integrations"`);
        await queryRunner.query(`DROP TYPE "public"."Integrations_category_enum"`);
        await queryRunner.query(`DROP TYPE "public"."Integrations_app_type_enum"`);
        await queryRunner.query(`DROP TYPE "public"."Integrations_provider_enum"`);
    }

}
