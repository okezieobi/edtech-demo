import connection from '../src/entities';

afterAll(async () => {
  const resolvedConnection = await connection();
  if (resolvedConnection.isConnected) await resolvedConnection.close();
});
