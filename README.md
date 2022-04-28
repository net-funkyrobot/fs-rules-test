# FS Rules Test

A Mocha test setup that demonstrates an issue in the Firebase rules testing library.

## Prerequisites and setup

Use Node `lts/gallium`.

Install node dependencies and install set up local emulator via `firebase-tools` installed via NPM:

```
npm i
npm run setup
```

## Issue replication

Run test command:

```
npm test
```

Observe in the test output that only two tests are run:

```
➜  fs_rules_test git:(main) ✗ npm test

> test
> firebase emulators:exec --only firestore "mocha firestore.rules.spec.ts"

i  emulators: Starting emulators: firestore
i  firestore: Firestore Emulator logging to firestore-debug.log
i  Running script: mocha firestore.rules.spec.ts
 2   -_-_,------,
 0   -_-_|   /\_/\
 0   -_-^|__( ^ .^)
     -_-  ""  ""

  2 passing (3ms)

✔  Script exited successfully (code 0)
i  emulators: Shutting down emulators.
i  firestore: Stopping Firestore Emulator
```

Move a dummy test _after_ the call to `initializeTestEnvironment()`:

Before:

```typescript
describe('Firestore rules', async () => {
  // MOVE THIS...
  it('should pass also', async () => {
    return true
  })

  const testEnv = await initializeTestEnvironment({
    projectId: PROJECT_ID,
    firestore: {
      rules: readFileSync('firestore.rules', 'utf-8'),
    },
  })

  // ... TO HERE

  beforeEach(async () => {
    testEnv.cleanup()
    await testEnv.clearFirestore()
  })

  // ...
```

After:

```typescript
describe('Firestore rules', async () => {
  const testEnv = await initializeTestEnvironment({
    projectId: PROJECT_ID,
    firestore: {
      rules: readFileSync('firestore.rules', 'utf-8'),
    },
  })

  // ... TO HERE
  it('should pass also', async () => {
    return true
  })

  beforeEach(async () => {
    testEnv.cleanup()
    await testEnv.clearFirestore()
  })

  // ...
```

Rerun the tests and observe the test that has moved does not get run:

```
➜  fs_rules_test git:(main) ✗ npm test

> test
> firebase emulators:exec --only firestore "mocha firestore.rules.spec.ts"

i  emulators: Starting emulators: firestore
i  firestore: Firestore Emulator logging to firestore-debug.log
i  Running script: mocha firestore.rules.spec.ts
 1   -__,------,
 0   -__|  /\_/\
 0   -_~|_( ^ .^)
     -_ ""  ""

  1 passing (3ms)

✔  Script exited successfully (code 0)
i  emulators: Shutting down emulators.
i  firestore: Stopping Firestore Emulator
```
