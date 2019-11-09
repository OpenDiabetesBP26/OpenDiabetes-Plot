import { Selector } from 'testcafe';
fixture `Home tests`
    .page `http://localhost:8080`;

test('Title visible', async t => {
    await t.click('#nav_home');
    // Test title text
    await t.expect(Selector('#home_pagetitle').textContent).contains('Home');
});