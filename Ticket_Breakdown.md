# Ticket Breakdown

We are a staffing company whose primary purpose is to book Agents at Shifts posted by Facilities on our platform. We're working on a new feature which will generate reports for our client Facilities containing info on how many hours each Agent worked in a given quarter by summing up every Shift they worked. Currently, this is how the process works:

- Data is saved in the database in the Facilities, Agents, and Shifts tables
- A function `getShiftsByFacility` is called with the Facility's id, returning all Shifts worked that quarter, including some metadata about the Agent assigned to each
- A function `generateReport` is then called with the list of Shifts. It converts them into a PDF which can be submitted by the Facility for compliance.

## You've been asked to work on a ticket. It reads:

**Currently, the id of each Agent on the reports we generate is their internal database id. We'd like to add the ability for Facilities to save their own custom ids for each Agent they work with and use that id when generating reports for them.**

Based on the information given, break this ticket down into 2-5 individual tickets to perform. Provide as much detail for each ticket as you can, including acceptance criteria, time/effort estimates, and implementation details. Feel free to make informed guesses about any unknown details - you can't guess "wrong".

You will be graded on the level of detail in each ticket, the clarity of the execution plan within and between tickets, and the intelligibility of your language. You don't need to be a native English speaker, but please proof-read your work.

## Your Breakdown Here

---

## Epic: Provide Facilities with customizable agent IDs

### Ticket 1 - Create a table for Facilities to save custom information about agents

Epic: Provide Facilities with customizable agent IDs.

#### Story:

To allow our client Facilities to assign a customizable ID for the agents they are working with, we must create an `Agents_Facilities` table to persist that information.

#### Details:

- With the assumption we are currently working with SQL tables, the new table could have the first column be the Facilities ID, the second column be the Agents ID and the third column a `custom_id`.
- Proper indexing on the `Facilities` column is needed to ensure fast retrieval of all the `custom_id` associated with a given facility.
- Uniqueness must also be guaranteed: there should only be one row for each Facilities - Agents pair.

#### Estimate:

- 3 story points.

#### Acceptance criteria:

- A new table is created, allowing to save a `custom_id` for each Facilities - Agents pairs.
- An index on the `Facilities` column exists.

### Ticket 2 - Make API endpoints to support setting and updating agents' customizable ID

Epic: Provide Facilities with customizable agent IDs.

#### Story:

Our client Facilities must be able to save and update a custom ID for each agent they are working with.

#### Details:

- Assumption: we are dealing with a REST API. A POST and PATCH endpoint should allow client Facilities to save and update information about agents they are working with. Although we only need to record a `custom_id`, it is preferred to create a generic endpoint and future-proof this route should clients wish in the future to save additional information about the agents they are working with (comments, ratings etc...)
- Care should be put into sanitizing the user input (eg: allow alpha-numerical characters only, allow a maximum of a 100 characters per ID).
- Before saving the `custom_id`, verification should be made that the `agent_id` and `Facilities_id` provided in the request matches with an existing agent and facility in our database.
- We should ensure that the `Facilities_id` match the credentials of the authenticated user: Facility Alice should not be able to record a `custom_id` for Facility Bob!

#### Estimate:

- 5 story points.

#### Acceptance criteria:

- The client Facilities can save a `custom_id` for agents they are working with.
- The client Facilities can update a `custom_id` for agents they are working with.
- The associated unit and integration tests verify that the endpoints are successfully saving valid requests to the database and rejecting improperly constructed requests or requests associated with agents that do not exist.
- A properly built request should fail if the logged-in user does not belong to the Facility in question.

#### Dependency:

- Ticket 1 - Create a table for Facilities to save custom information about agents

### Ticket 3 - Refactor getShiftsByFacility function

Epic: Provide Facilities with customizable agent IDs.

#### Story:

When our client Facilities visualize all the shifts that have been worked that quarter we must replace the agents database ID with the custom ID given to the agent by that Facility if it exists.

#### Details:

 - The database query triggered by `getShiftsByFacility` should include our new `Agents_Facilities` table and replace the ID from the `Agents` table with the `custom_id` matching that Agent and Facility in the `Agents_Facilities` table if it is not null.

#### Estimate:

- 3 story points.

#### Acceptance criteria:

- When the client Facilities visualize the shifts that have been worked for in any given quarter the agents custom ID should be shown instead of the database ID.
- Tests should verify a null value in the `Agents_Facilities` table for a given Agent and Facility will not mistakenly replace the ID from the Agents table.

#### Dependency:

- Ticket 2 - Make API endpoints to support setting and updating agents' customizable ID
