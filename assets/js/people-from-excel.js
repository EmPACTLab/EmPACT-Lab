(function () {
    'use strict';

    // These are browser-safe Supabase connection details. Row Level Security
    // limits visitors to reading active public profiles only.
    const supabaseUrl = 'https://usmwruhlclmivyzfucmj.supabase.co';
    const supabasePublishableKey = 'sb_publishable_j1aGA4kD3t_Rk2ckx0n0eQ_N4KQTZz5';
    const peopleEndpoint = supabaseUrl + '/rest/v1/people?select=*&order=name.asc';
    const sectionOrder = [
        { key: 'Principal Investigator', title: 'Principal Investigator' },
        { key: 'Research Staff', title: 'Research Staff' },
        { key: 'PhD Students', title: 'PhD Students' },
        { key: 'Master Students', title: 'Master Students' },
        { key: 'Interns and UG Students', title: 'Interns and UG Students' },
        { key: 'Alumni', title: 'Alumni' }
    ];

    function text(value) {
        return String(value == null ? '' : value).trim();
    }

    function escapeHTML(value) {
        return text(value).replace(/[&<>'"]/g, function (character) {
            return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character];
        });
    }

    function validLink(url) {
        return /^https?:\/\//i.test(text(url));
    }

    function imagePath(image) {
        const filename = text(image);
        if (/^https?:\/\//i.test(filename)) return filename;
        return 'assets/images/Prof.jpg';
    }

    function socialLink(url, icon, label, personName) {
        if (validLink(url)) {
            return '<a class="person-social-link" href="' + escapeHTML(url) + '" target="_blank" rel="noopener noreferrer" aria-label="' + escapeHTML(label + ' for ' + personName) + '" title="' + escapeHTML(label) + '">' + icon + '</a>';
        }
        return '<span class="person-social-link person-social-link--disabled" aria-hidden="true" title="' + escapeHTML(label + ' unavailable') + '">' + icon + '</span>';
    }

    function socialLinks(person, className) {
        const name = text(person.Name);
        return '<div class="' + className + '" aria-label="' + escapeHTML(name + '\'s profiles') + '">' +
            socialLink(person['Google Scholar'], '<i class="fa fa-graduation-cap"></i>', 'Google Scholar', name) +
            socialLink(person.LinkedIn, '<i class="fa fa-linkedin"></i>', 'LinkedIn', name) +
            socialLink(person.Website, '<i class="fa fa-globe"></i>', 'Personal website', name) +
            '</div>';
    }

    function createPersonCard(person) {
        const education = text(person.Education);
        const name = escapeHTML(person.Name);
        return '<div class="col-md-4">' +
            '<div class="team-member" style="background: linear-gradient(to bottom, #ffffff 0%, #f9f9f9 100%); border-radius: 12px; padding: 30px 20px; margin-bottom: 30px; box-shadow: 0 2px 10px rgba(0,0,0,0.08); transition: all 0.3s ease; text-align: center; border: 1px solid #e8e8e8;">' +
            '<div class="person-photo"><img src="' + escapeHTML(imagePath(person.Image)) + '" alt="' + name + '" loading="lazy" decoding="async"></div>' +
            '<h4 class="person-name" style="color: #1a1a1a; font-weight: 600; font-size: 18px;">' + name + '</h4>' +
            '<div style="width: 40px; height: 3px; background: linear-gradient(to right, #dc2626, #ef4444); margin: 8px auto 12px; border-radius: 2px;"></div>' +
            '<p style="color: #dc2626; margin-bottom: 12px; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">' + escapeHTML(person.Role) + '</p>' +
            '<p class="person-research" title="' + escapeHTML(person.Research) + '" style="font-size: 13px; color: #666; line-height: 1.6;">' + escapeHTML(person.Research) + '</p>' +
            '<p class="person-education' + (education ? '' : ' person-education--empty') + '" title="' + escapeHTML(education) + '" style="font-size: 11px; color: #888; border-top: 1px solid #e8e8e8; font-style: italic;">' +
            (education ? '<i class="fa fa-graduation-cap" style="margin-right: 4px; color: #dc2626;"></i>' + escapeHTML(education) : '&nbsp;') +
            '</p>' + socialLinks(person, 'person-social-links') + '</div></div>';
    }

    function createAlumniCard(person) {
        const name = escapeHTML(person.Name);
        return '<div class="col-md-4">' +
            '<div class="team-member alumni-card" style="background: linear-gradient(to bottom, #ffffff 0%, #f9f9f9 100%); border-radius: 12px; padding: 30px 20px; margin-bottom: 30px; box-shadow: 0 2px 10px rgba(0,0,0,0.08); transition: all 0.3s ease; text-align: center; border: 1px solid #e8e8e8;">' +
            '<div class="person-photo"><img src="' + escapeHTML(imagePath(person.Image)) + '" alt="' + name + '" loading="lazy" decoding="async"></div>' +
            '<h4 class="person-name" style="color: #1a1a1a; font-weight: 600; font-size: 18px;">' + name + '</h4>' +
            '<div style="width: 40px; height: 3px; background: linear-gradient(to right, #dc2626, #ef4444); margin: 8px auto 12px; border-radius: 2px;"></div>' +
            '<p style="color: #dc2626; margin-bottom: 12px; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Alumni</p>' +
            socialLinks(person, 'person-social-links') + '</div></div>';
    }

    function createProfessor(person) {
        const name = escapeHTML(person.Name);
        const affiliation = text(person.Affiliation) || 'School of Electrical and Electronic Engineering, NTU Singapore';
        const biography = text(person.Biography) || text(person.Research);
        return '<div class="col-md-12"><h2 style="border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 30px;">Principal Investigator</h2></div>' +
            '<div class="col-md-12"><div style="background: linear-gradient(to bottom, #ffffff 0%, #f9f9f9 100%); border-radius: 12px; padding: 35px 30px; box-shadow: 0 2px 10px rgba(0,0,0,0.08); border: 1px solid #e8e8e8;"><div class="row">' +
            '<div class="col-md-3 text-center"><div style="width: 200px; height: 200px; margin: 0 auto; overflow: hidden; border-radius: 50%; box-shadow: 0 4px 12px rgba(0,0,0,0.1);"><img src="' + escapeHTML(imagePath(person.Image)) + '" alt="' + name + '" decoding="async" style="width: 100%; height: 100%; object-fit: cover; object-position: center top;"></div></div>' +
            '<div class="col-md-9"><h3 style="margin-top: 0; color: #1a1a1a; font-weight: 600;">' + name + '</h3>' +
            '<div style="width: 50px; height: 3px; background: linear-gradient(to right, #dc2626, #ef4444); margin: 10px 0 15px 0; border-radius: 2px;"></div>' +
            '<p style="color: #dc2626; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; font-size: 14px; margin-bottom: 8px;">' + escapeHTML(person.Role) + '</p>' +
            '<p style="color: #555; margin-bottom: 15px;">' + escapeHTML(affiliation) + '</p>' +
            '<p style="margin-top: 15px; color: #666; line-height: 1.7;">' + escapeHTML(biography) + '</p>' +
            socialLinks(person, 'professor-social-links') + '</div></div></div></div>';
    }

    function activePerson(person) {
        const active = text(person.Active).toLowerCase();
        return !active || ['true', 'yes', '1'].indexOf(active) !== -1;
    }

    function sortPeople(people, section) {
        return people.sort(function (a, b) {
            if (section === 'PhD Students') {
                const aIsVisiting = text(a.Role).toLowerCase().indexOf('visiting') !== -1;
                const bIsVisiting = text(b.Role).toLowerCase().indexOf('visiting') !== -1;
                if (aIsVisiting !== bIsVisiting) return aIsVisiting ? 1 : -1;
            }
            return text(a.Name).localeCompare(text(b.Name), undefined, { sensitivity: 'base' });
        });
    }

    function sectionForRole(role) {
        const normalizedRole = text(role).toLowerCase();
        if (normalizedRole.indexOf('professor') !== -1) return 'Principal Investigator';
        if (normalizedRole.indexOf('alumni') !== -1) return 'Alumni';
        if (normalizedRole.indexOf('phd') !== -1) return 'PhD Students';
        if (normalizedRole.indexOf('msc') !== -1 || normalizedRole.indexOf('m.eng') !== -1 || normalizedRole.indexOf('master') !== -1) return 'Master Students';
        if (normalizedRole.indexOf('intern') !== -1 || normalizedRole.indexOf('ug') !== -1 || normalizedRole.indexOf('undergraduate') !== -1) return 'Interns and UG Students';
        return 'Research Staff';
    }

    function renderPeople(people) {
        const principalContainer = document.getElementById('principal-investigator-container');
        const teamContainer = document.getElementById('team-members-container');
        const bySection = {};

        people.filter(activePerson).forEach(function (person) {
			if (!text(person.Name)) return;
			const section = sectionForRole(person.Role);
            (bySection[section] = bySection[section] || []).push(person);
        });

        const principal = sortPeople(bySection['Principal Investigator'] || []);
        principalContainer.innerHTML = principal.length ? createProfessor(principal[0]) : '';

        let teamHTML = '';
        sectionOrder.slice(1).forEach(function (section) {
            const group = sortPeople(bySection[section.key] || [], section.key);
            if (!group.length) return;
            teamHTML += '<div class="col-md-12"><h3 style="margin-top: 30px; margin-bottom: 20px; color: #333;">' + section.title + '</h3></div>';
            group.forEach(function (person) {
                teamHTML += section.key === 'Alumni' ? createAlumniCard(person) : createPersonCard(person);
            });
        });
        teamContainer.innerHTML = teamHTML || '<div class="col-md-12"><p>No active team members are currently listed.</p></div>';
    }

    function peopleFromSupabase(rows) {
        if (!Array.isArray(rows)) {
            throw new Error('Supabase returned an invalid People response.');
        }
        return rows.map(function (person) {
            const imageName = text(person.image_filename);
            return {
                Name: person.name,
                Role: person.role,
                Research: person.research,
                Image: imageName ? supabaseUrl + '/storage/v1/object/public/people-images/' + encodeURIComponent(imageName) : '',
                'Google Scholar': person.google_scholar,
                LinkedIn: person.linkedin,
                Website: person.website,
                Education: person.education,
                Affiliation: person.affiliation,
                Biography: person.biography,
                Active: person.active ? '1' : '0'
            };
        });
    }

    function loadPeople() {
        const teamContainer = document.getElementById('team-members-container');
        teamContainer.innerHTML = '<div class="col-md-12"><p>Loading team members…</p></div>';

        function fail(error) {
            const reason = error && error.message ? error.message : 'Supabase could not be reached.';
            teamContainer.innerHTML = '<div class="col-md-12"><p>Unable to load the People directory: ' + escapeHTML(reason) + '</p></div>';
            console.error('People directory error:', error);
        }

        fetch(peopleEndpoint, {
            headers: {
                apikey: supabasePublishableKey,
                Authorization: 'Bearer ' + supabasePublishableKey
            }
        }).then(function (response) {
            if (!response.ok) throw new Error('Supabase returned ' + response.status + ' ' + response.statusText + '.');
            return response.json();
        }).then(function (rows) {
            renderPeople(peopleFromSupabase(rows));
        }).catch(fail);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadPeople);
    } else {
        loadPeople();
    }
}());
