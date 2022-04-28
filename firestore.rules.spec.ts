import { before, beforeEach, after } from 'mocha'
import { readFileSync } from 'fs'
import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
} from '@firebase/rules-unit-testing'
import { doc, setDoc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore'

const PROJECT_ID = 'net-funkyrobot-blox-firestore-rules-testing'

describe('A test that should get run', async () => {
  it('should pass', async () => {
    return true
  })
})

describe('Firestore rules', async () => {
  it('should pass also', async () => {
    return true
  })

  const testEnv = await initializeTestEnvironment({
    projectId: PROJECT_ID,
    firestore: {
      rules: readFileSync('firestore.rules', 'utf-8'),
    },
  })

  beforeEach(async () => {
    testEnv.cleanup()
    await testEnv.clearFirestore()
  })

  after(async () => {
    testEnv.cleanup()
    await testEnv.clearFirestore()
  })

  const uid = 'normal-user'
  const user = testEnv.authenticatedContext(uid)
  const userRef = doc(user.firestore(), `users/${uid}/`)
  const dummyUserDoc = { displayName: 'John Smith' }

  it('ensures can create their own user document', async () => {
    await assertSucceeds(setDoc(userRef, dummyUserDoc))
  })

  it('ensures they can read their user document', async () => {
    testEnv.withSecurityRulesDisabled(async () => {
      setDoc(userRef, dummyUserDoc)
    })
    await assertSucceeds(getDoc(userRef))
  })

  it('ensures they can update their user document', async () => {
    testEnv.withSecurityRulesDisabled(async () => {
      setDoc(userRef, dummyUserDoc)
    })
    await assertSucceeds(updateDoc(userRef, { foo: 'baz' }))
  })

  it('ensures cannot delete their user document', async () => {
    testEnv.withSecurityRulesDisabled(async () => {
      setDoc(userRef, dummyUserDoc)
    })
    await assertFails(deleteDoc(userRef))
  })
})
