import { type ClientSchema, a, defineData, defineFunction } from "@aws-amplify/backend";
import { Operation } from "aws-cdk-lib/aws-dynamodb";

/*== STEP 1 ===============================================================
The section below creates a Todo database table with a "content" field. Try
adding a new "isDone" field as a boolean. The authorization rule below
specifies that any user authenticated via an API key can "create", "read",
"update", and "delete" any "Todo" records.
=========================================================================*/
const schema = a.schema({
  // Todo: a
  //   .model({
  //     content: a.string(),
  //   })
  //   .authorization(allow => [allow.owner()]),
  Post: a.model({
      // Defining fields for Post data
      id: a.string().required(),
      content: a.string(),
      likes: a.email().array().required().authorization(allow => allow.authenticated()), // A list of email or user IDs
      dislikes: a.string().array().required(), // A list of dislikes
      subfeed: a.string(), // The category/subfeed of the post
      timestamp: a.string(), // Timestamp in ISO format
      user: a.string(), // The user who created the post
      title: a.string().required(), // The title of the post
    })
    .authorization(allow => [
      // Allow anyone auth'd with an API key to read everyone's posts.
    allow.authenticated().to(['read']),
    // Allow signed-in user to create, read, update,
    // and delete their __OWN__ posts.
    allow.owner(),
    ]),
    
  SubFeed: a.model({
    post: a.string(),
    content: a.string(),
    comementor: a.string(),
  })
  .authorization(allow => [allow.owner(), allow.authenticated().to(["list"])]),
  
  StudyGroup: a.model({
    title: a.string().required(),
    description: a.string().required(),
    subject: a.string().required(),
    members: a.email().array().required(),
    professor: a.string().required(),
    comments: a.string().array()
  })
  .authorization(allow => [allow.owner(), allow.authenticated().to(["list"])]),
  
  FlashCard: a.customType({
    title: a.string().required(),
    description: a.string().required(),
    details: a.string()
  }),

  Resource: a.model({
    title: a.string(),
    link: a.string(),
    category: a.string(),
    professor: a.string(),
    description: a.string(),
    flashcards: a.ref('FlashCard').required().array()
  })
  .authorization(allow => [allow.owner(), allow.authenticated().to(["list"])]),

  User: a.model({
    userId: a.string(),
    name: a.string(),
    familyName: a.string(),
    preferredName: a.string(),
    major: a.string(),
    email: a.email(),
  })
  .authorization(allow => [allow.owner(), allow.authenticated().to(["list"])]),

});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool',
    apiKeyAuthorizationMode: {
      expiresInDays: 30
    }
  },
});

/*== STEP 2 ===============================================================
Go to your frontend source code. From your client-side code, generate a
Data client to make CRUDL requests to your table. (THIS SNIPPET WILL ONLY
WORK IN THE FRONTEND CODE FILE.)

Using JavaScript or Next.js React Server Components, Middleware, Server 
Actions or Pages Router? Review how to generate Data clients for those use
cases: https://docs.amplify.aws/gen2/build-a-backend/data/connect-to-API/
=========================================================================*/

/*
"use client"
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";

const client = generateClient<Schema>() // use this Data client for CRUDL requests
*/

/*== STEP 3 ===============================================================
Fetch records from the database and use them in your frontend component.
(THIS SNIPPET WILL ONLY WORK IN THE FRONTEND CODE FILE.)
=========================================================================*/

/* For example, in a React component, you can use this snippet in your
  function's RETURN statement */
// const { data: todos } = await client.models.Todo.list()

// return <ul>{todos.map(todo => <li key={todo.id}>{todo.content}</li>)}</ul>
