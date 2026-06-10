import axios from "axios";
import type { Knex } from "knex";

const EXERCISES_URL =
  "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/dist/exercises.json";

interface RemoteExercise {
  id: string;
  name: string;
  force: string | null;
  level: string | null;
  mechanic: string | null;
  equipment: string | null;
  primaryMuscles: string[];
  secondaryMuscles: string[];
  instructions: string[];
  category: string | null;
  images: string[];
}

interface ExerciseInsert {
  name: string;
  force: string | null;
  level: string | null;
  mechanic: string | null;
  equipment: string | null;
  primaryMuscles: string;
  secondaryMuscles: string;
  instructions: string;
  category: string | null;
  images: string | null;
  id: string;
}

export async function seed(knex: Knex): Promise<void> {
  const response = await axios.get<RemoteExercise[]>(EXERCISES_URL, {
    timeout: 30_000,
  });

  if (!Array.isArray(response.data)) {
    throw new Error("Exercise seed API returned an invalid response");
  }

  const existingExercises = await knex<{ name: string }>("exercises").select(
    "name",
  );
  const existingNames = new Set(existingExercises.map(({ name }) => name));

  const exercises = response.data
    .filter((exercise) => exercise.name && !existingNames.has(exercise.name))
    .map(
      ({
        name,
        force,
        level,
        mechanic,
        equipment,
        primaryMuscles,
        secondaryMuscles,
        instructions,
        category,
        images,
        id,
      }): ExerciseInsert => ({
        name,
        force,
        level,
        mechanic,
        equipment,
        primaryMuscles: JSON.stringify(primaryMuscles),
        secondaryMuscles: JSON.stringify(secondaryMuscles),
        images: JSON.stringify(images),
        instructions: JSON.stringify(instructions),
        category,
        id,
      }),
    );

  if (exercises.length === 0) {
    console.log("Exercise seed skipped: all exercises already exist");
    return;
  }

  await knex.transaction(async (trx) => {
    await trx.batchInsert("exercises", exercises, 100);
  });

  console.log(
    `Exercise seed completed: inserted ${exercises.length} exercises`,
  );
}
