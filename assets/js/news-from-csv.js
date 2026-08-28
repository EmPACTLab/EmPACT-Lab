(function () {
    'use strict';

    const supabaseUrl = 'https://usmwruhlclmivyzfucmj.supabase.co';
    const supabasePublishableKey = 'sb_publishable_j1aGA4kD3t_Rk2ckx0n0eQ_N4KQTZz5';
    const newsEndpoint = supabaseUrl + '/rest/v1/news_info?select=*&order=id.desc';
    const typeDetails = {
        keynote: { icon: 'fa-microphone', label: 'Keynote' },
        award: { icon: 'fa-trophy', label: 'Award' },
        congratulations: { icon: 'fa-graduation-cap', label: '🎉 Congratulations' },
        publication: { icon: 'fa-file-text', label: 'Publication' },
        people: { icon: 'fa-users', label: 'People' },
        announcement: { icon: 'fa-bullhorn', label: 'Announcement' }
    };

    function text(value) {
        return String(value == null ? '' : value).trim();
    }

    function escapeHTML(value) {
        return text(value).replace(/[&<>'"]/g, function (character) {
            return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character];
        });
    }

    function validLink(value) {
        return /^https?:\/\//i.test(text(value));
    }

    function entriesFromSupabase(rows) {
        if (!Array.isArray(rows)) throw new Error('Supabase returned an invalid News response.');
        return rows.filter(function (entry) {
            return entry.active !== false && text(entry.date) && text(entry.title);
        });
    }

    function dateValue(entry) {
        const match = text(entry.date).match(/^(January|February|March|April|May|June|July|August|September|October|November|December)\s+(20\d{2})$/i);
        if (!match) return 0;
        const months = {
            january: 0, february: 1, march: 2, april: 3, may: 4, june: 5,
            july: 6, august: 7, september: 8, october: 9, november: 10, december: 11
        };
        return Number(match[2]) * 12 + months[match[1].toLowerCase()];
    }

    function orderedEntries(entries) {
        return entries.slice().sort(function (first, second) {
            return dateValue(second) - dateValue(first) || text(first.title).localeCompare(text(second.title));
        });
    }

    function yearFor(entry) {
        const match = text(entry.date).match(/\b(20\d{2})\b/);
        return match ? match[1] : 'Other';
    }

    function detailsFor(entry) {
        const key = text(entry.type).toLowerCase();
        return { key: typeDetails[key] ? key : 'announcement', value: typeDetails[key] || { icon: 'fa-newspaper-o', label: 'News' } };
    }

    function newsCard(entry) {
        const details = detailsFor(entry);
        const title = escapeHTML(entry.title);
        const link = validLink(entry.link) ? escapeHTML(entry.link) : '';
        const action = link ? '<a class="news-card__link" href="' + link + '" target="_blank" rel="noopener noreferrer">Read more <i class="fa fa-external-link" aria-hidden="true"></i></a>' : '';
        const heading = link ? '<a href="' + link + '" target="_blank" rel="noopener noreferrer">' + title + '</a>' : title;
        return '<article class="news-card news-card--' + details.key + '">' +
            '<div class="news-card__topline"><span class="news-card__type"><i class="fa ' + details.value.icon + '" aria-hidden="true"></i> ' + details.value.label + '</span><time>' + escapeHTML(entry.date) + '</time></div>' +
            '<h2 class="news-card__title">' + heading + '</h2>' +
            '<p class="news-card__description">' + escapeHTML(entry.description) + '</p>' + action +
            '</article>';
    }

    function newsWidgetItem(entry) {
        return '<div class="news-widget-item"><span class="news-widget-date">' + escapeHTML(entry.date) + '</span>' +
            '<p class="news-widget-headline">' + escapeHTML(entry.title) + '</p>' +
            '<p class="news-widget-description">' + escapeHTML(entry.description) + '</p></div>';
    }

    function render(entries) {
        const ordered = orderedEntries(entries);
        const container = document.getElementById('newsContainer');
        const widget = document.getElementById('latest-news-list');
        if (container) {
            const byYear = ordered.reduce(function (groups, entry) {
                const year = yearFor(entry);
                (groups[year] = groups[year] || []).push(entry);
                return groups;
            }, {});
            const years = Object.keys(byYear).sort(function (first, second) {
                if (first === 'Other') return 1;
                if (second === 'Other') return -1;
                return Number(second) - Number(first);
            });
            container.innerHTML = years.length ? years.map(function (year, index) {
                const panelId = 'news-year-' + year;
                const items = byYear[year];
                return '<section class="news-year">' +
                    '<button class="news-year-toggle" type="button" aria-expanded="' + (index === 0 ? 'true' : 'false') + '" aria-controls="' + panelId + '">' +
                    '<span class="news-year-title">' + escapeHTML(year) + '</span>' +
                    '<span class="news-year-count">' + items.length + ' update' + (items.length === 1 ? '' : 's') + '</span>' +
                    '<i class="fa fa-chevron-down news-year-chevron" aria-hidden="true"></i>' +
                    '</button>' +
                    '<div id="' + panelId + '" class="news-year-content"' + (index === 0 ? '' : ' hidden') + '><div class="news-grid">' + items.map(newsCard).join('') + '</div></div>' +
                    '</section>';
            }).join('') : '<p class="news-status">No news is currently listed.</p>';

            Array.prototype.forEach.call(container.querySelectorAll('.news-year-toggle'), function (button) {
                button.addEventListener('click', function () {
                    const content = document.getElementById(button.getAttribute('aria-controls'));
                    const isOpen = button.getAttribute('aria-expanded') === 'true';
                    button.setAttribute('aria-expanded', String(!isOpen));
                    content.hidden = isOpen;
                });
            });
        }
        if (widget) {
            widget.innerHTML = ordered.slice(0, 3).map(newsWidgetItem).join('') || '<p class="news-widget-description">No recent news yet.</p>';
        }
    }

    function showError() {
        const container = document.getElementById('newsContainer');
        const widget = document.getElementById('latest-news-list');
        if (container) container.innerHTML = '<p class="news-status">Unable to load news at the moment.</p>';
        if (widget) widget.innerHTML = '<p class="news-widget-description">Unable to load recent news.</p>';
    }

    function loadNews() {
        fetch(newsEndpoint, {
            headers: {
                apikey: supabasePublishableKey,
                Authorization: 'Bearer ' + supabasePublishableKey
            }
        }).then(function (response) {
            if (!response.ok) throw new Error('Supabase returned ' + response.status + ' ' + response.statusText + '.');
            return response.json();
        }).then(function (rows) {
            render(entriesFromSupabase(rows));
        }).catch(function (error) {
            console.error('News loading error:', error);
            showError();
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadNews);
    } else {
        loadNews();
    }
}());
