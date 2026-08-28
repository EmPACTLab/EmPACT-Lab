(function () {
    'use strict';

    const supabaseUrl = 'https://usmwruhlclmivyzfucmj.supabase.co';
    const supabasePublishableKey = 'sb_publishable_j1aGA4kD3t_Rk2ckx0n0eQ_N4KQTZz5';
    const publicationsEndpoint = supabaseUrl + '/rest/v1/publications?select=*&order=year.desc,paper_name.asc';

    function text(value) {
        return String(value == null ? '' : value).trim();
    }

    function escapeHTML(value) {
        return text(value).replace(/[&<>'"]/g, function (character) {
            return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character];
        });
    }

    function isLink(url) {
        return /^https?:\/\//i.test(text(url));
    }

    function displayVenue(record) {
        const year = text(record.Year);
        const rawVenue = text(record.Venue);
        if (/^arxiv\b/i.test(rawVenue)) return 'Preprint · ' + year;

        const venue = rawVenue
            .replace(/\b20\d{2}\b/g, '')
            .replace(/\b\d+(?:\s*[-–]\s*\d+)?\b/g, '')
            .replace(/\(\s*\)/g, '')
            .replace(/\s*,\s*,+/g, ', ')
            .replace(/\s*,\s*$/g, '')
            .replace(/\s{2,}/g, ' ')
            .trim();
        return (venue || 'Publication') + (year ? ' · ' + year : '');
    }

    function recordsFromSupabase(rows) {
        if (!Array.isArray(rows)) throw new Error('Supabase returned an invalid Publications response.');
        return rows.map(function (publication) {
            return {
                Year: publication.year,
                'Paper Name': publication.paper_name,
                Venue: publication.venue,
                Authors: publication.authors,
                Link: publication.link,
                Category: publication.category,
                'Sub Category': publication.sub_category,
                'Special Mentions': publication.special_mentions
            };
        }).filter(function (record) {
            return text(record.Year) && text(record['Paper Name']);
        });
    }

    function cardHTML(record) {
        const title = escapeHTML(record['Paper Name']);
        const venue = escapeHTML(displayVenue(record));
        const authors = escapeHTML(record.Authors);
        const specialMention = escapeHTML(record['Special Mentions']);
        const category = escapeHTML(record.Category);
        const subcategory = escapeHTML(record['Sub Category']);
        const hasPaperLink = isLink(record.Link);
        const searchTitle = escapeHTML(text(record['Paper Name']).toLowerCase());
        const topic = escapeHTML(text(record.Category).toLowerCase());
        const subtopic = escapeHTML(text(record['Sub Category']).toLowerCase());
        const tags = [
            category ? '<span class="publication-card-tag">' + category + '</span>' : '',
            subcategory ? '<span class="publication-card-tag">' + subcategory + '</span>' : ''
        ].join('');
        const content =
            '<div class="publication-card-meta"><span class="publication-card-venue">' + venue + '</span>' +
            (specialMention ? '<span class="publication-card-mention">' + specialMention + '</span>' : '') + '</div>' +
            '<h3 class="publication-card-title">' + title + '</h3>' +
            '<p class="publication-card-authors">' + authors + '</p>' +
            '<div class="publication-card-actions">' +
            (hasPaperLink ? '<span class="publication-card-link">Open Paper <i class="fa fa-external-link" aria-hidden="true"></i></span>' : '') +
            tags + '</div>';

        if (hasPaperLink) {
            return '<a class="publication-card" data-title="' + searchTitle + '" data-topic="' + topic + '" data-subtopic="' + subtopic + '" href="' + escapeHTML(record.Link) + '" target="_blank" rel="noopener noreferrer">' + content + '</a>';
        }
        return '<article class="publication-card publication-card--unlinked" data-title="' + searchTitle + '" data-topic="' + topic + '" data-subtopic="' + subtopic + '">' + content + '</article>';
    }

    function uniqueAlphabetical(values) {
        const found = {};
        values.forEach(function (value) {
            const label = text(value);
            if (label) found[label.toLowerCase()] = label;
        });
        return Object.keys(found).map(function (key) { return found[key]; }).sort(function (first, second) {
            return first.localeCompare(second, undefined, { sensitivity: 'base' });
        });
    }

    function setFilterOptions(select, defaultLabel, values) {
        select.innerHTML = '<option value="">' + escapeHTML(defaultLabel) + '</option>' + values.map(function (value) {
            return '<option value="' + escapeHTML(value) + '">' + escapeHTML(value) + '</option>';
        }).join('');
    }

    function selectFilterValue(select, value) {
        const requested = text(value).toLowerCase();
        if (!requested) return false;
        const matchingOption = Array.prototype.find.call(select.options, function (option) {
            return text(option.value).toLowerCase() === requested;
        });
        if (!matchingOption) return false;
        select.value = matchingOption.value;
        return true;
    }

    function renderPublications(records) {
        const container = document.getElementById('publications-container');
        const grouped = records.reduce(function (groups, record) {
            const year = text(record.Year);
            (groups[year] = groups[year] || []).push(record);
            return groups;
        }, {});
        const years = Object.keys(grouped).sort(function (a, b) { return Number(b) - Number(a); });

        container.innerHTML = years.map(function (year, index) {
            // The spreadsheet can be maintained in any order.  Within each
            // year, present papers alphabetically by title on the website.
            const entries = grouped[year].slice().sort(function (first, second) {
                return text(first['Paper Name']).localeCompare(text(second['Paper Name']), undefined, {
                    sensitivity: 'base',
                    numeric: true
                });
            });
            const panelId = 'publication-year-' + year;
            return '<section class="publication-year" data-year="' + escapeHTML(year) + '">' +
                '<button class="publication-year-toggle" type="button" aria-expanded="' + (index === 0 ? 'true' : 'false') + '" aria-controls="' + panelId + '">' +
                '<span class="publication-year-title">' + escapeHTML(year) + '</span>' +
                '<span class="publication-year-count">' + entries.length + ' publication' + (entries.length === 1 ? '' : 's') + '</span>' +
                '<i class="fa fa-chevron-down publication-year-chevron" aria-hidden="true"></i>' +
                '</button>' +
                '<div id="' + panelId + '" class="publication-year-content"' + (index === 0 ? '' : ' hidden') + '>' +
                entries.map(cardHTML).join('') +
                '</div></section>';
        }).join('') || '<p class="publication-status">No publications are currently listed in Supabase.</p>';

        Array.prototype.forEach.call(container.querySelectorAll('.publication-year-toggle'), function (button) {
            button.addEventListener('click', function () {
                const content = document.getElementById(button.getAttribute('aria-controls'));
                const isOpen = button.getAttribute('aria-expanded') === 'true';
                button.setAttribute('aria-expanded', String(!isOpen));
                content.hidden = isOpen;
            });
        });

        const searchInput = document.getElementById('publication-search');
        const topicSelect = document.getElementById('publication-topic');
        const subtopicSelect = document.getElementById('publication-subtopic');
        const clearButton = document.getElementById('publication-clear');
        if (searchInput && topicSelect && subtopicSelect) {
            const topics = uniqueAlphabetical(records.map(function (record) { return record.Category; }));

            function updateSubtopics() {
                const chosenTopic = text(topicSelect.value).toLowerCase();
                const subtopics = uniqueAlphabetical(records.filter(function (record) {
                    return !chosenTopic || text(record.Category).toLowerCase() === chosenTopic;
                }).map(function (record) { return record['Sub Category']; }));
                setFilterOptions(subtopicSelect, 'All sub-topics', subtopics);
            }

            function applyFilters() {
                const query = text(searchInput.value).toLowerCase();
                const chosenTopic = text(topicSelect.value).toLowerCase();
                const chosenSubtopic = text(subtopicSelect.value).toLowerCase();
                const hasFilter = query || chosenTopic || chosenSubtopic;
                Array.prototype.forEach.call(container.querySelectorAll('.publication-year'), function (section, sectionIndex) {
                    const cards = section.querySelectorAll('.publication-card');
                    let matchCount = 0;
                    Array.prototype.forEach.call(cards, function (card) {
                        const titleMatches = !query || card.getAttribute('data-title').indexOf(query) !== -1;
                        const topicMatches = !chosenTopic || card.getAttribute('data-topic') === chosenTopic;
                        const subtopicMatches = !chosenSubtopic || card.getAttribute('data-subtopic') === chosenSubtopic;
                        const matches = titleMatches && topicMatches && subtopicMatches;
                        card.hidden = !matches;
                        if (matches) matchCount += 1;
                    });
                    section.hidden = matchCount === 0;
                    const button = section.querySelector('.publication-year-toggle');
                    const content = section.querySelector('.publication-year-content');
                    const shouldOpen = hasFilter ? matchCount > 0 : sectionIndex === 0;
                    button.setAttribute('aria-expanded', String(shouldOpen));
                    content.hidden = !shouldOpen;
                });
            }
            setFilterOptions(topicSelect, 'All topics', topics);
            const filterParameters = new URLSearchParams(window.location.search);
            const topicWasRequested = selectFilterValue(topicSelect, filterParameters.get('topic'));
            updateSubtopics();
            const subtopicWasRequested = selectFilterValue(subtopicSelect, filterParameters.get('subtopic'));
            searchInput.addEventListener('input', applyFilters);
            searchInput.addEventListener('search', applyFilters);
            topicSelect.addEventListener('change', function () {
                updateSubtopics();
                applyFilters();
            });
            subtopicSelect.addEventListener('change', applyFilters);
            if (clearButton) {
                clearButton.addEventListener('click', function () {
                    searchInput.value = '';
                    topicSelect.value = '';
                    updateSubtopics();
                    subtopicSelect.value = '';
                    applyFilters();
                    searchInput.focus();
                });
            }
            if (topicWasRequested || subtopicWasRequested) applyFilters();
        }
    }

    function loadPublications() {
        const container = document.getElementById('publications-container');
        container.innerHTML = '<p class="publication-status">Loading publications…</p>';

        function fail(error) {
            const reason = error && error.message ? error.message : 'Supabase could not be reached.';
            container.innerHTML = '<p class="publication-status publication-status--error">Unable to load publications: ' + escapeHTML(reason) + '</p>';
            console.error('Publication directory error:', error);
        }

        fetch(publicationsEndpoint, {
            headers: {
                apikey: supabasePublishableKey,
                Authorization: 'Bearer ' + supabasePublishableKey
            }
        }).then(function (response) {
            if (!response.ok) throw new Error('Supabase returned ' + response.status + ' ' + response.statusText + '.');
            return response.json();
        }).then(function (rows) {
            renderPublications(recordsFromSupabase(rows));
        }).catch(fail);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadPublications);
    } else {
        loadPublications();
    }
}());
