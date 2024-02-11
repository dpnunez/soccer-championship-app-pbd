-- CreateTable
CREATE TABLE "championship" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "active" BOOLEAN,

    CONSTRAINT "championship_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "coach" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "age" INTEGER NOT NULL,
    "picture" TEXT,

    CONSTRAINT "coach_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "goal" (
    "id" SERIAL NOT NULL,
    "id_match" INTEGER NOT NULL,
    "id_player" INTEGER NOT NULL,
    "id_team" INTEGER NOT NULL,
    "id_championship" INTEGER NOT NULL,

    CONSTRAINT "goal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "match" (
    "id" SERIAL NOT NULL,
    "id_referee" INTEGER NOT NULL,
    "id_championship" INTEGER NOT NULL,

    CONSTRAINT "match_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "match_stats" (
    "id_match" INTEGER NOT NULL,
    "id_home_team" INTEGER NOT NULL,
    "id_visiting_team" INTEGER NOT NULL,
    "id_winner" INTEGER,
    "is_draw" BOOLEAN DEFAULT 
CASE
    WHEN (id_winner IS NULL) THEN true
    ELSE false
END,

    CONSTRAINT "match_stats_pkey" PRIMARY KEY ("id_match")
);

-- CreateTable
CREATE TABLE "player" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "age" INTEGER NOT NULL,
    "origin" VARCHAR(100),
    "picture" TEXT,
    "dominant_leg" CHAR(1) NOT NULL,

    CONSTRAINT "player_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "player_championship" (
    "id_player" INTEGER NOT NULL,
    "id_championship" INTEGER NOT NULL,
    "id_team" INTEGER NOT NULL,

    CONSTRAINT "player_championship_pkey" PRIMARY KEY ("id_player","id_championship","id_team")
);

-- CreateTable
CREATE TABLE "referee" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100),
    "age" INTEGER NOT NULL,
    "picture" TEXT NOT NULL,

    CONSTRAINT "referee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "team" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "emblem" TEXT,

    CONSTRAINT "team_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "team_championship" (
    "id_team" INTEGER NOT NULL,
    "id_championship" INTEGER NOT NULL,
    "id_coach" INTEGER,

    CONSTRAINT "team_championship_pkey" PRIMARY KEY ("id_team","id_championship")
);

-- CreateTable
CREATE TABLE "user" (
    "username" VARCHAR(255) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "password" TEXT NOT NULL,
    "type" VARCHAR(50) NOT NULL,
    "id_team" INTEGER,

    CONSTRAINT "user_pkey" PRIMARY KEY ("username")
);

-- AddForeignKey
ALTER TABLE "goal" ADD CONSTRAINT "fk_match" FOREIGN KEY ("id_match") REFERENCES "match"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "goal" ADD CONSTRAINT "fk_player" FOREIGN KEY ("id_player", "id_championship", "id_team") REFERENCES "player_championship"("id_player", "id_championship", "id_team") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "match" ADD CONSTRAINT "fk_championship" FOREIGN KEY ("id_championship") REFERENCES "championship"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "match" ADD CONSTRAINT "fk_referee" FOREIGN KEY ("id_referee") REFERENCES "referee"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "match_stats" ADD CONSTRAINT "fk_home_team" FOREIGN KEY ("id_home_team") REFERENCES "team"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "match_stats" ADD CONSTRAINT "fk_visiting_team" FOREIGN KEY ("id_visiting_team") REFERENCES "team"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "match_stats" ADD CONSTRAINT "fk_winner" FOREIGN KEY ("id_winner") REFERENCES "team"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "player_championship" ADD CONSTRAINT "fk_id_championshipt" FOREIGN KEY ("id_championship") REFERENCES "championship"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "player_championship" ADD CONSTRAINT "fk_id_player" FOREIGN KEY ("id_player") REFERENCES "player"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "player_championship" ADD CONSTRAINT "fk_id_team" FOREIGN KEY ("id_team") REFERENCES "team"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "team_championship" ADD CONSTRAINT "fk_id_championshipt" FOREIGN KEY ("id_championship") REFERENCES "championship"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "team_championship" ADD CONSTRAINT "fk_id_coach" FOREIGN KEY ("id_coach") REFERENCES "coach"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "team_championship" ADD CONSTRAINT "fk_id_team" FOREIGN KEY ("id_team") REFERENCES "team"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "fk_id_team" FOREIGN KEY ("id_team") REFERENCES "team"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

