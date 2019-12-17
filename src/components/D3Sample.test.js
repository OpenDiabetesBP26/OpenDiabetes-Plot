import { Selector } from 'testcafe';
fixture `D3Sample tests`
    .page `http://localhost:8080`;

test('Title visible', async t => {
    await t.click('#nav_d3sample');
    // Test title text
    await t.expect(Selector('#d3sample_pagetitle').textContent).contains('D3 Sample');
});

// test('5 circles on page', async t => {
    //     await t.click('#nav_d3sample');
        // const img = Selector('#d3sample_image')
    //     const circles = Selector('#d3sample_image circle');
    //     await t.expect(circles.count).eql(5);
// });