async function login(email, password) {
    return await client.post('/api/admin/login').send({email, password});
}
