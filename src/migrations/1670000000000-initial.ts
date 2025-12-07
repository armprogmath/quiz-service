import { MigrationInterface, QueryRunner } from "typeorm";

export class initial1670000000000 implements MigrationInterface {
    name = 'initial1670000000000'

    public async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "role" character varying NOT NULL DEFAULT 'user', CONSTRAINT "UQ_users_email" UNIQUE ("email"), CONSTRAINT "PK_users_id" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "quizzes" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "description" character varying, "timeLimit" integer, CONSTRAINT "PK_quizzes_id" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "questions" ("id" SERIAL NOT NULL, "question_text" character varying NOT NULL, "options" text NOT NULL, "correct_option_index" integer NOT NULL, "quizId" integer, CONSTRAINT "PK_questions_id" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "attempts" ("id" SERIAL NOT NULL, "startedAt" TIMESTAMP WITH TIME ZONE NOT NULL, "finishedAt" TIMESTAMP WITH TIME ZONE, "userId" integer, "quizId" integer, CONSTRAINT "PK_attempts_id" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "results" ("id" SERIAL NOT NULL, "score" integer NOT NULL, "answers" jsonb NOT NULL, "userId" integer, "quizId" integer, "attemptId" integer, CONSTRAINT "PK_results_id" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "questions" ADD CONSTRAINT "FK_questions_quiz" FOREIGN KEY ("quizId") REFERENCES "quizzes"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "attempts" ADD CONSTRAINT "FK_attempts_user" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "attempts" ADD CONSTRAINT "FK_attempts_quiz" FOREIGN KEY ("quizId") REFERENCES "quizzes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "results" ADD CONSTRAINT "FK_results_user" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "results" ADD CONSTRAINT "FK_results_quiz" FOREIGN KEY ("quizId") REFERENCES "quizzes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "results" ADD CONSTRAINT "FK_results_attempt" FOREIGN KEY ("attemptId") REFERENCES "attempts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "results" DROP CONSTRAINT "FK_results_attempt"`);
        await queryRunner.query(`ALTER TABLE "results" DROP CONSTRAINT "FK_results_quiz"`);
        await queryRunner.query(`ALTER TABLE "results" DROP CONSTRAINT "FK_results_user"`);
        await queryRunner.query(`ALTER TABLE "attempts" DROP CONSTRAINT "FK_attempts_quiz"`);
        await queryRunner.query(`ALTER TABLE "attempts" DROP CONSTRAINT "FK_attempts_user"`);
        await queryRunner.query(`ALTER TABLE "questions" DROP CONSTRAINT "FK_questions_quiz"`);
        await queryRunner.query(`DROP TABLE "results"`);
        await queryRunner.query(`DROP TABLE "attempts"`);
        await queryRunner.query(`DROP TABLE "questions"`);
        await queryRunner.query(`DROP TABLE "quizzes"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }
}
