window.addEventListener('DOMContentLoaded', function () {
    // Get all the elements I'll be using
    const head = document.getElementsByTagName('head')[0];
    const header = document.getElementsByTagName('header')[0];
    const body = document.getElementsByTagName('body')[0];

    // Create, modify, and add elements
    const bar = document.createElement('div');
    const link = document.createElement('link');

    bar.className = 'app-bar';

    link.id = 'custom-theme';
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = 'yugen://' + process.env['APP_PATH'] + '/assets/styles.css';
    link.media = 'all';

    body.insertBefore(bar, header);
    head.appendChild(link);
});
