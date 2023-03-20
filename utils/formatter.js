function formatQueryWord(queryWord, delimiter) {
    let totalQueryWord = '';
    let splitQueryWord = queryWord.split(' ');
    splitQueryWord.forEach((word, index) => {
        totalQueryWord += word;
        if (index != splitQueryWord.length - 1) {
            totalQueryWord += delimiter;
        }
    });

	  return totalQueryWord;
}

function formatEntry(entry) {
    if (!entry) return;

    entry = entry.replace('\"', '\'');
    entry = entry.replace('\n', ' ');
    entry = entry.trim();

    return entry;
}

async function formatJobProps(jobPropsElement) {
    const jobProps = await Promise.all(jobPropsElement.map(async jobPropEl => await jobPropEl.evaluate(el => el.textContent)));
    jobPropsElement.forEach(async elem => await elem.dispose());

    return jobProps.reduce((total, current) => total.trim() + ' ' + current.trim());
}

module.exports = {
    formatQueryWord: formatQueryWord,
    formatEntry: formatEntry,
    formatJobProps: formatJobProps
}
