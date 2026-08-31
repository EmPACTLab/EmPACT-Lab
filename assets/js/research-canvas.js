/**
 * Animated background canvases for six research topic cards, for the
 * Embodied Perception and Interaction (EmPACT) Lab.
 *
 * The lab's own framing -- perception and interaction, grounded in a
 * physical, embodied agent -- is the throughline across scenes. A small
 * shared robot glyph (see robotGlyph()) stands in for that one embodied
 * agent and recurs across perception, fusion, spatial reasoning, and
 * on-device compute, so the six cards read as six facets of the same
 * research subject rather than six unrelated diagrams:
 *
 *   neuro-physics-perception    A physical stimulus wave (light/sound) passes
 *                               through layered biological receptors, which
 *                               fire spikes along dendrites into the agent's
 *                               perceiving head.
 *                               -> bio-inspired structure processing a
 *                                  physics-grounded signal into an embodied
 *                                  agent's perception.
 *
 *   multi-sensor-fusion         Four distinct, recognizable sensor icons
 *                               (camera aperture, lidar sweep, mic waveform,
 *                               IMU axes) stream into one onboard agent.
 *                               -> heterogeneous modalities fused inside a
 *                                  single embodied platform, not floating
 *                                  in the abstract.
 *
 *   spatial-intelligence        A 3D point cloud and rotating wireframe object
 *                               sit on a ground plane, with the agent glyph
 *                               tracing a navigation path across it.
 *                               -> 3D reasoning + mapping/navigation done BY
 *                                  the embodied agent, not just "a cube."
 *
 *   edge-ai-embodied-agents     The same robot body, now with an onboard chip
 *                               running a tight, local sense -> think -> act
 *                               loop inside a dashed "on-device" boundary.
 *                               -> compute embedded in the physical agent, no
 *                                  cloud round-trip.
 *
 *   data-efficient-robotics     A handful of labeled demonstrations (not a
 *                               firehose of particles) feed a compact model
 *                               that fans out to many generalized outcomes,
 *                               all serving one capable agent.
 *                               -> few examples in, broad capability out.
 *
 *   human-ai-agent-interaction  A human silhouette and a robot-like agent
 *                               silhouette, visually distinct, exchange turns
 *                               of dialogue around a shared task object.
 *                               -> collaboration, not two identical blobs.
 *                               (left as-is by request)
 */
(function () {
    'use strict';

    const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const palette = {
        cyan: '#54d6ff', blue: '#7994ff', violet: '#be8cff', pink: '#ff7eaa', gold: '#ffcc66', mint: '#62e6ba'
    };

    // ---------------------------------------------------------------------
    // generic drawing helpers
    // ---------------------------------------------------------------------

    function hash(value) {
        let result = 2166136261;
        for (let index = 0; index < value.length; index += 1) result = Math.imul(result ^ value.charCodeAt(index), 16777619);
        return result >>> 0;
    }

    function random(seed) {
        let state = seed || 1;
        return function () {
            state = (state * 1664525 + 1013904223) >>> 0;
            return state / 4294967296;
        };
    }

    function line(ctx, x1, y1, x2, y2, color, width, alpha) {
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = color;
        ctx.lineWidth = width || 1;
        ctx.globalAlpha = alpha == null ? 1 : alpha;
        ctx.stroke();
        ctx.globalAlpha = 1;
    }

    function polyline(ctx, points, color, width, alpha) {
        if (!points.length) return;
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        for (let index = 1; index < points.length; index += 1) ctx.lineTo(points[index].x, points[index].y);
        ctx.strokeStyle = color;
        ctx.lineWidth = width || 1.5;
        ctx.globalAlpha = alpha == null ? 1 : alpha;
        ctx.stroke();
        ctx.globalAlpha = 1;
    }

    function dot(ctx, x, y, radius, color, alpha) {
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.globalAlpha = alpha == null ? 1 : alpha;
        ctx.fill();
        ctx.globalAlpha = 1;
    }

    function ring(ctx, x, y, radius, color, alpha, width) {
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.strokeStyle = color;
        ctx.lineWidth = width || 1.5;
        ctx.globalAlpha = alpha == null ? 1 : alpha;
        ctx.stroke();
        ctx.globalAlpha = 1;
    }

    function arcPath(ctx, x, y, radius, start, end, color, alpha, width) {
        ctx.beginPath();
        ctx.arc(x, y, radius, start, end);
        ctx.strokeStyle = color;
        ctx.lineWidth = width || 1.5;
        ctx.globalAlpha = alpha == null ? 1 : alpha;
        ctx.stroke();
        ctx.globalAlpha = 1;
    }

    function glow(ctx, x, y, radius, color, alpha) {
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
        gradient.addColorStop(0, color);
        gradient.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.globalAlpha = alpha;
        ctx.fillStyle = gradient;
        ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);
        ctx.globalAlpha = 1;
    }

    function roundRectPath(ctx, x, y, w, h, r) {
        const radius = Math.min(r, w / 2, h / 2);
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.arcTo(x + w, y, x + w, y + h, radius);
        ctx.arcTo(x + w, y + h, x, y + h, radius);
        ctx.arcTo(x, y + h, x, y, radius);
        ctx.arcTo(x, y, x + w, y, radius);
        ctx.closePath();
    }

    // The lab's one embodied agent, reused across scenes. (x, y) is the
    // center of the agent's "eye" -- the point other elements (signal
    // lines, path markers) should aim at.
    function robotGlyph(ctx, x, y, scale, bodyColor, eyeColor, alpha) {
        const a = alpha == null ? 1 : alpha;
        const headW = 18 * scale;
        const headH = 14 * scale;
        const bodyW = 22 * scale;
        const bodyH = 18 * scale;
        const headTopY = y - headH / 2;
        const bodyTopY = y + headH / 2 + 2 * scale;

        ctx.fillStyle = bodyColor;
        ctx.globalAlpha = a;
        roundRectPath(ctx, x - headW / 2, headTopY, headW, headH, 3 * scale);
        ctx.fill();
        roundRectPath(ctx, x - bodyW / 2, bodyTopY, bodyW, bodyH, 4 * scale);
        ctx.fill();
        ctx.globalAlpha = 1;

        line(ctx, x, headTopY, x, headTopY - 6 * scale, bodyColor, 1.5 * scale, a);
        dot(ctx, x, headTopY - 7 * scale, 1.6 * scale, bodyColor, a);
        dot(ctx, x, y, 1.8 * scale, eyeColor, a);
    }

    function background(ctx, width, height, accent) {
        const gradient = ctx.createLinearGradient(0, 0, width, height);
        gradient.addColorStop(0, '#0b1324');
        gradient.addColorStop(1, '#17213b');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
        glow(ctx, width * 0.82, height * 0.16, width * 0.45, accent, 0.12);
    }

    // ---------------------------------------------------------------------
    // scene: Cognitive, Neuro and Physics-Inspired Perception
    // robotic arm: almost picks one object -> decides -> picks another object
    // -> returns to pick the first object -> places all in the final area
    // ---------------------------------------------------------------------

    function bioPerception(ctx, width, height, time, state) {
        background(ctx, width, height, palette.pink);

        const cycleLength = 10500;
        const t = (time % cycleLength) / cycleLength;
        const pulse = 0.5 + Math.sin(time * 0.004) * 0.5;

        function clamp(v, min, max) {
            return Math.max(min, Math.min(max, v));
        }

        function smooth(u) {
            u = clamp(u, 0, 1);
            return u * u * (3 - 2 * u);
        }

        function lerp(a, b, u) {
            return a + (b - a) * smooth(u);
        }

        function lerpPoint(a, b, u) {
            return {
                x: lerp(a.x, b.x, u),
                y: lerp(a.y, b.y, u)
            };
        }

        function phase(a, b) {
            return clamp((t - a) / (b - a), 0, 1);
        }

        function downUp(hover, pick, u) {
            if (u < 0.5) return lerpPoint(hover, pick, u * 2);
            return lerpPoint(pick, hover, (u - 0.5) * 2);
        }

        const tableY = height * 0.78;

        const sourceA = { x: width * 0.29, y: tableY - 11 };
        const sourceB = { x: width * 0.50, y: tableY - 11 };

        const placeB = { x: width * 0.73, y: tableY - 11 };
        const placeA = { x: width * 0.82, y: tableY - 11 };

        const home = { x: width * 0.22, y: height * 0.32 };

        const hoverA = { x: sourceA.x, y: sourceA.y - 48 };
        const pickA = { x: sourceA.x, y: sourceA.y - 18 };

        const hoverB = { x: sourceB.x, y: sourceB.y - 48 };
        const pickB = { x: sourceB.x, y: sourceB.y - 18 };

        const placeBHover = { x: placeB.x, y: placeB.y - 48 };
        const placeBDrop = { x: placeB.x, y: placeB.y - 18 };

        const placeAHover = { x: placeA.x, y: placeA.y - 48 };
        const placeADrop = { x: placeA.x, y: placeA.y - 18 };

        let ee;

        if (t < 0.12) {
            // arm moves toward the first object
            ee = lerpPoint(home, hoverA, phase(0.00, 0.12));
        } else if (t < 0.26) {
            // decision pause: it is about to pick A, then changes plan
            ee = {
                x: hoverA.x + Math.sin(time * 0.006) * 3,
                y: hoverA.y + Math.cos(time * 0.006) * 2
            };
        } else if (t < 0.38) {
            // redirects toward the other object
            ee = lerpPoint(hoverA, hoverB, phase(0.26, 0.38));
        } else if (t < 0.48) {
            // pick object B
            ee = downUp(hoverB, pickB, phase(0.38, 0.48));
        } else if (t < 0.60) {
            // carry object B to the place area
            ee = lerpPoint(hoverB, placeBHover, phase(0.48, 0.60));
        } else if (t < 0.68) {
            // place object B
            ee = downUp(placeBHover, placeBDrop, phase(0.60, 0.68));
        } else if (t < 0.78) {
            // return to the first object
            ee = lerpPoint(placeBHover, hoverA, phase(0.68, 0.78));
        } else if (t < 0.87) {
            // pick object A
            ee = downUp(hoverA, pickA, phase(0.78, 0.87));
        } else if (t < 0.95) {
            // carry object A to the place area
            ee = lerpPoint(hoverA, placeAHover, phase(0.87, 0.95));
        } else {
            // place object A and reset
            ee = downUp(placeAHover, placeADrop, phase(0.95, 1.00));
        }

        const carryingB = t >= 0.43 && t < 0.64;
        const placedB = t >= 0.64;

        const carryingA = t >= 0.82 && t < 0.98;
        const placedA = t >= 0.98;

        let posA = placedA ? placeA : sourceA;
        let posB = placedB ? placeB : sourceB;

        if (carryingB) {
            posB = { x: ee.x, y: ee.y + 22 };
        }

        if (carryingA) {
            posA = { x: ee.x, y: ee.y + 22 };
        }

        const gripperClosed =
            carryingA ||
            carryingB ||
            (t >= 0.40 && t < 0.48) ||
            (t >= 0.80 && t < 0.87);

        // -----------------------------------------------------------------
        // environment: table, sources, final placement area
        // -----------------------------------------------------------------

        ctx.fillStyle = 'rgba(84,214,255,0.08)';
        roundRectPath(ctx, width * 0.12, tableY, width * 0.78, height * 0.035, 8);
        ctx.fill();

        line(ctx, width * 0.12, tableY, width * 0.90, tableY, palette.cyan, 1, 0.35);

        // final placement zone
        ctx.save();
        ctx.setLineDash([5, 5]);
        ctx.strokeStyle = 'rgba(255,204,102,0.55)';
        ctx.lineWidth = 1.2;
        roundRectPath(ctx, width * 0.67, tableY - 35, width * 0.21, 42, 10);
        ctx.stroke();
        ctx.restore();

        glow(ctx, width * 0.77, tableY - 15, 42, palette.gold, 0.08);

        // target highlight logic
        const consideringA = t < 0.26 || (t >= 0.68 && t < 0.87);
        const consideringB = t >= 0.20 && t < 0.68;

        if (consideringA && !placedA && !carryingA) {
            ring(ctx, sourceA.x, sourceA.y, 18 + pulse * 4, palette.cyan, 0.35, 1.2);
        }

        if (consideringB && !placedB && !carryingB) {
            ring(ctx, sourceB.x, sourceB.y, 18 + pulse * 4, palette.gold, 0.45, 1.2);
        }

        // -----------------------------------------------------------------
        // decision signal: the arm nearly chooses A, then switches to B
        // -----------------------------------------------------------------

        if (t >= 0.12 && t < 0.30) {
            const d = phase(0.12, 0.30);
            const node = {
                x: width * 0.39,
                y: height * 0.28
            };

            glow(ctx, node.x, node.y, 30 + pulse * 8, palette.violet, 0.28);
            ring(ctx, node.x, node.y, 12 + pulse * 2, palette.violet, 0.8, 1.5);
            dot(ctx, node.x, node.y, 3.5, palette.violet, 0.95);

            ctx.save();
            ctx.setLineDash([4, 4]);

            // faint rejected intention toward A
            line(ctx, node.x, node.y, sourceA.x, sourceA.y - 15, palette.cyan, 1, 0.18 * (1 - d));

            // stronger new intention toward B
            line(ctx, node.x, node.y, sourceB.x, sourceB.y - 15, palette.gold, 1.3, 0.18 + d * 0.45);

            ctx.restore();

            const switchX = lerp(sourceA.x, sourceB.x, d);
            const switchY = lerp(sourceA.y - 38, sourceB.y - 38, d);
            glow(ctx, switchX, switchY, 16, palette.gold, 0.22 + d * 0.25);
            dot(ctx, switchX, switchY, 3.2, palette.gold, 0.9);

            ctx.font = Math.max(10, Math.floor(width * 0.04)) + 'px system-ui, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = 'rgba(255,255,255,' + (0.35 + pulse * 0.45).toFixed(3) + ')';
            ctx.fillText('?', node.x, node.y - 1);
        }

        // -----------------------------------------------------------------
        // object drawing
        // -----------------------------------------------------------------

        function drawCubeObject(p, color, alpha) {
            const a = alpha == null ? 1 : alpha;
            glow(ctx, p.x, p.y, 18, color, 0.15 * a);

            ctx.save();
            ctx.globalAlpha = a;
            ctx.fillStyle = color;
            roundRectPath(ctx, p.x - 8, p.y - 8, 16, 16, 4);
            ctx.fill();

            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 1;
            ctx.globalAlpha = 0.28 * a;
            roundRectPath(ctx, p.x - 8, p.y - 8, 16, 16, 4);
            ctx.stroke();

            ctx.restore();
        }

        function drawSphereObject(p, color, alpha) {
            const a = alpha == null ? 1 : alpha;
            glow(ctx, p.x, p.y, 18, color, 0.18 * a);
            dot(ctx, p.x, p.y, 8.5, color, 0.92 * a);
            ring(ctx, p.x, p.y, 9.5, '#ffffff', 0.22 * a, 1);
        }

        if (!carryingA) drawCubeObject(posA, palette.cyan, placedA ? 0.85 : 0.95);
        if (!carryingB) drawSphereObject(posB, palette.gold, placedB ? 0.85 : 0.95);

        // -----------------------------------------------------------------
        // robotic arm with simple inverse kinematics
        // -----------------------------------------------------------------

        function drawRobotArm(endPoint, closed) {
            const base = {
                x: width * 0.14,
                y: tableY - 2
            };

            const l1 = width * 0.34;
            const l2 = width * 0.33;

            const dx = endPoint.x - base.x;
            const dy = endPoint.y - base.y;
            const rawDist = Math.sqrt(dx * dx + dy * dy);
            const dist = clamp(rawDist, 20, l1 + l2 - 4);

            const angleToTarget = Math.atan2(dy, dx);
            const cosA = clamp((l1 * l1 + dist * dist - l2 * l2) / (2 * l1 * dist), -1, 1);
            const shoulderAngle = angleToTarget - Math.acos(cosA);

            const elbow = {
                x: base.x + Math.cos(shoulderAngle) * l1,
                y: base.y + Math.sin(shoulderAngle) * l1
            };

            // base
            glow(ctx, base.x, base.y, 28, palette.violet, 0.18);
            ctx.fillStyle = 'rgba(190,140,255,0.20)';
            roundRectPath(ctx, base.x - 18, base.y - 10, 36, 22, 6);
            ctx.fill();

            ring(ctx, base.x, base.y, 10, palette.violet, 0.8, 2);

            // links
            line(ctx, base.x, base.y, elbow.x, elbow.y, palette.violet, 7, 0.38);
            line(ctx, base.x, base.y, elbow.x, elbow.y, palette.violet, 2, 0.95);

            line(ctx, elbow.x, elbow.y, endPoint.x, endPoint.y, palette.cyan, 7, 0.30);
            line(ctx, elbow.x, elbow.y, endPoint.x, endPoint.y, palette.cyan, 2, 0.95);

            // joints
            dot(ctx, elbow.x, elbow.y, 7, palette.violet, 0.95);
            ring(ctx, elbow.x, elbow.y, 10, palette.cyan, 0.45, 1);

            dot(ctx, endPoint.x, endPoint.y, 5, palette.cyan, 0.95);

            // gripper
            const open = closed ? 5 : 11;
            const gripLength = 17;

            line(ctx, endPoint.x, endPoint.y, endPoint.x, endPoint.y + 8, palette.cyan, 2, 0.9);

            line(ctx, endPoint.x, endPoint.y + 8, endPoint.x - open, endPoint.y + gripLength, palette.cyan, 2, 0.95);
            line(ctx, endPoint.x, endPoint.y + 8, endPoint.x + open, endPoint.y + gripLength, palette.cyan, 2, 0.95);

            dot(ctx, endPoint.x - open, endPoint.y + gripLength, 2.2, palette.cyan, 0.95);
            dot(ctx, endPoint.x + open, endPoint.y + gripLength, 2.2, palette.cyan, 0.95);
        }

        drawRobotArm(ee, gripperClosed);

        // draw carried objects on top of gripper
        if (carryingB) drawSphereObject(posB, palette.gold, 0.95);
        if (carryingA) drawCubeObject(posA, palette.cyan, 0.95);

        // subtle embodied cognition pulse from decision node to the arm
        if (t >= 0.12 && t < 0.95) {
            const signalProgress = (time * 0.0007) % 1;
            const start = { x: width * 0.39, y: height * 0.28 };
            const end = ee;
            const sx = start.x + (end.x - start.x) * signalProgress;
            const sy = start.y + (end.y - start.y) * signalProgress;
            dot(ctx, sx, sy, 2.2, palette.mint, 0.55);
        }
    }

    // ---------------------------------------------------------------------
    // scene: Multi-Sensor Fusion
    // four distinct sensor modalities streaming into one fused core
    // ---------------------------------------------------------------------

    function drawSensorIcon(ctx, x, y, color, kind, time) {
        if (kind === 'camera') {
            ring(ctx, x, y, 8, color, 0.9, 1.5);
            dot(ctx, x, y, 3, color, 0.9);
            for (let i = 0; i < 6; i += 1) {
                const a = (i / 6) * Math.PI * 2;
                line(ctx, x + Math.cos(a) * 5, y + Math.sin(a) * 5, x + Math.cos(a) * 9, y + Math.sin(a) * 9, color, 1, 0.85);
            }
        } else if (kind === 'lidar') {
            const sweep = (time * 0.0015) % (Math.PI * 2);
            arcPath(ctx, x, y, 11, sweep, sweep + 0.9, color, 0.9, 1.5);
            arcPath(ctx, x, y, 7, sweep, sweep + 0.9, color, 0.55, 1);
            dot(ctx, x, y, 2.5, color, 0.95);
        } else if (kind === 'audio') {
            for (let i = -3; i <= 3; i += 1) {
                const h = 4 + Math.abs(Math.sin(time * 0.004 + i)) * 8;
                line(ctx, x + i * 3, y + h / 2, x + i * 3, y - h / 2, color, 2, 0.85);
            }
        } else if (kind === 'imu') {
            ring(ctx, x, y, 9, color, 0.5, 1);
            line(ctx, x - 10, y, x + 10, y, color, 1, 0.85);
            line(ctx, x, y - 10, x, y + 10, color, 1, 0.85);
            dot(ctx, x, y, 2.5, color, 0.95);
        }
    }

    function sensorFusion(ctx, width, height, time) {
        background(ctx, width, height, palette.mint);

        const cycleLength = 11500;
        const t = (time % cycleLength) / cycleLength;
        const pulse = 0.5 + Math.sin(time * 0.004) * 0.5;

        function clamp(v, min, max) {
            return Math.max(min, Math.min(max, v));
        }

        function smooth(u) {
            u = clamp(u, 0, 1);
            return u * u * (3 - 2 * u);
        }

        function lerp(a, b, u) {
            return a + (b - a) * smooth(u);
        }

        function phase(a, b) {
            return clamp((t - a) / (b - a), 0, 1);
        }

        function drawRadarIcon(ctx, x, y, color, active) {
            const sweep = (time * 0.002) % (Math.PI * 2);
            const alpha = active ? 0.95 : 0.35;

            glow(ctx, x, y, active ? 34 : 20, color, active ? 0.28 : 0.08);
            dot(ctx, x, y, 3, color, alpha);

            arcPath(ctx, x, y, 9, sweep, sweep + 1.1, color, alpha, 1.7);
            arcPath(ctx, x, y, 15, sweep, sweep + 1.1, color, alpha * 0.65, 1.2);
            arcPath(ctx, x, y, 21, sweep, sweep + 1.1, color, alpha * 0.45, 1);

            line(
                ctx,
                x,
                y,
                x + Math.cos(sweep + 0.55) * 22,
                y + Math.sin(sweep + 0.55) * 22,
                color,
                1,
                alpha * 0.7
            );
        }

        function drawSmallObstacle(x, y, color, alpha) {
            glow(ctx, x, y, 20, color, 0.12 * alpha);
            ctx.fillStyle = color;
            ctx.globalAlpha = 0.22 * alpha;
            roundRectPath(ctx, x - 13, y - 25, 26, 36, 7);
            ctx.fill();
            ctx.globalAlpha = 1;

            // ring(ctx, x, y, 17, color, 0.35 * alpha, 1);
        }

        function drawDecisionNode(x, y, label, color) {
            glow(ctx, x, y, 34 + pulse * 8, color, 0.24 + pulse * 0.12);
            ring(ctx, x, y, 14 + pulse * 2, color, 0.8, 1.5);
            dot(ctx, x, y, 4, color, 0.95);

            ctx.font = Math.max(9, Math.floor(width * 0.034)) + 'px system-ui, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = 'rgba(255,255,255,0.8)';
            ctx.fillText(label, x, y + 1);
        }

        function drawArrowPath(points, color, alpha) {
            polyline(ctx, points, color, 1.5, alpha);
            const last = points[points.length - 1];
            const prev = points[points.length - 2];
            const angle = Math.atan2(last.y - prev.y, last.x - prev.x);

            line(ctx, last.x, last.y, last.x - Math.cos(angle - 0.6) * 8, last.y - Math.sin(angle - 0.6) * 8, color, 1.4, alpha);
            line(ctx, last.x, last.y, last.x - Math.cos(angle + 0.6) * 8, last.y - Math.sin(angle + 0.6) * 8, color, 1.4, alpha);
        }

        const roadY = height * 0.72;

        // ground / movement lane
        line(ctx, width * 0.08, roadY, width * 0.92, roadY, palette.cyan, 1, 0.35);

        ctx.save();
        ctx.setLineDash([6, 8]);
        line(ctx, width * 0.08, roadY + 22, width * 0.92, roadY + 22, palette.cyan, 1, 0.18);
        ctx.restore();

        // scene obstacles / uncertainty region
        drawSmallObstacle(width * 0.43, roadY - 14, palette.pink, 0.9);
        drawSmallObstacle(width * 0.64, roadY - 16, palette.violet, 0.75);

        // sensor icons around the robot path
        const camera = { x: width * 0.16, y: height * 0.24, color: palette.cyan };
        const radar = { x: width * 0.40, y: height * 0.20, color: palette.gold };
        const imu = { x: width * 0.66, y: height * 0.22, color: palette.mint };
        const audio = { x: width * 0.84, y: height * 0.30, color: palette.pink };

        let mode = 'camera';
        let modeColor = palette.cyan;
        let modeLabel = '';

        if (t >= 0.18 && t < 0.54) {
            mode = 'radar';
            modeColor = palette.gold;
            // modeLabel = 'RADAR';
        } else if (t >= 0.54) {
            mode = 'fusion';
            modeColor = palette.mint;
            // modeLabel = 'FUSE';
        }

        const activeCamera = mode === 'camera' || mode === 'fusion';
        const activeRadar = mode === 'radar';
        const activeImu = mode === 'fusion';
        const activeAudio = mode === 'fusion';

        drawSensorIcon(ctx, camera.x, camera.y, camera.color, 'camera', time);
        drawRadarIcon(ctx, radar.x, radar.y, radar.color, activeRadar);
        drawSensorIcon(ctx, imu.x, imu.y, imu.color, 'imu', time);
        drawSensorIcon(ctx, audio.x, audio.y, audio.color, 'audio', time);

        if (!activeCamera) ring(ctx, camera.x, camera.y, 19, camera.color, 0.16, 1);
        if (!activeImu) ring(ctx, imu.x, imu.y, 19, imu.color, 0.14, 1);
        if (!activeAudio) ring(ctx, audio.x, audio.y, 19, audio.color, 0.14, 1);

        // robot motion: moves, pauses to decide radar, moves, pauses again, switches, moves again
        let robotX;

        if (t < 0.18) {
            robotX = lerp(width * 0.16, width * 0.34, phase(0.00, 0.18));
        } else if (t < 0.30) {
            robotX = width * 0.34 + Math.sin(time * 0.006) * 2;
        } else if (t < 0.54) {
            robotX = lerp(width * 0.34, width * 0.58, phase(0.30, 0.54));
        } else if (t < 0.66) {
            robotX = width * 0.58 + Math.sin(time * 0.006) * 2;
        } else if (t < 0.92) {
            robotX = lerp(width * 0.58, width * 0.84, phase(0.66, 0.92));
        } else {
            robotX = lerp(width * 0.84, width * 0.16, phase(0.92, 1.00));
        }

        const robotY = roadY - 36;

        // onboard fusion core above robot
        const core = {
            x: robotX,
            y: robotY - 48
        };

        glow(ctx, core.x, core.y, 32 + pulse * 7, modeColor, 0.22 + pulse * 0.12);
        ring(ctx, core.x, core.y, 13, modeColor, 0.8, 1.4);
        dot(ctx, core.x, core.y, 4, modeColor, 0.95);

        // sensor streams into the moving onboard core
        function stream(sensor, color, active, offset) {
            const alpha = active ? 0.48 : 0.12;
            line(ctx, sensor.x, sensor.y, core.x, core.y, color, active ? 1.4 : 0.8, alpha);

            if (active) {
                const p = (time * 0.00045 + offset) % 1;
                const px = sensor.x + (core.x - sensor.x) * p;
                const py = sensor.y + (core.y - sensor.y) * p;
                glow(ctx, px, py, 8, color, 0.25);
                dot(ctx, px, py, 2.4, color, 0.95);
            }
        }

        stream(camera, palette.cyan, activeCamera, 0.0);
        stream(radar, palette.gold, activeRadar, 0.25);
        stream(imu, palette.mint, activeImu, 0.5);
        stream(audio, palette.pink, activeAudio, 0.75);

        // decision pauses
        if (t >= 0.18 && t < 0.30) {
            const d = phase(0.18, 0.30);

            drawDecisionNode(robotX, robotY - 82, '', palette.gold);

            ctx.save();
            ctx.setLineDash([4, 4]);

            // weak visual confidence because of obstacle/uncertainty
            line(ctx, robotX, robotY - 82, camera.x, camera.y, palette.cyan, 1, 0.18 * (1 - d));

            // stronger radar reliance
            line(ctx, robotX, robotY - 82, radar.x, radar.y, palette.gold, 1.5, 0.25 + d * 0.45);

            ctx.restore();

            ring(ctx, radar.x, radar.y, 29 + pulse * 4, palette.gold, 0.45 + d * 0.3, 1.3);
        }

        if (t >= 0.54 && t < 0.66) {
            const d = phase(0.54, 0.66);

            drawDecisionNode(robotX, robotY - 82, '+', palette.mint);

            ctx.save();
            ctx.setLineDash([4, 4]);

            // radar becomes less dominant
            line(ctx, robotX, robotY - 82, radar.x, radar.y, palette.gold, 1, 0.28 * (1 - d));

            // switch to a fused camera + imu + audio state
            line(ctx, robotX, robotY - 82, camera.x, camera.y, palette.cyan, 1.3, 0.20 + d * 0.25);
            line(ctx, robotX, robotY - 82, imu.x, imu.y, palette.mint, 1.3, 0.20 + d * 0.35);
            line(ctx, robotX, robotY - 82, audio.x, audio.y, palette.pink, 1.0, 0.14 + d * 0.22);

            ctx.restore();

            ring(ctx, imu.x, imu.y, 26 + pulse * 4, palette.mint, 0.35 + d * 0.35, 1.3);
        }

        // motion intention path
        const pathColor = modeColor;
        drawArrowPath(
            [
                { x: robotX - 24, y: roadY - 8 },
                { x: robotX + 8, y: roadY - 13 },
                { x: robotX + 38, y: roadY - 8 }
            ],
            pathColor,
            0.35
        );

        // robot
        glow(ctx, robotX, robotY, 36, modeColor, 0.18);
        robotGlyph(ctx, robotX, robotY, 1.1, modeColor, '#ffffff', 0.95);

        // small wheels / mobile base
        ctx.fillStyle = 'rgba(255,255,255,0.08)';
        roundRectPath(ctx, robotX - 24, robotY + 32, 48, 12, 6);
        ctx.fill();

        dot(ctx, robotX - 14, robotY + 44, 4, modeColor, 0.7);
        dot(ctx, robotX + 14, robotY + 44, 4, modeColor, 0.7);

        // tiny mode label
        ctx.font = Math.max(9, Math.floor(width * 0.035)) + 'px system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = 'rgba(255,255,255,0.65)';
        ctx.fillText(modeLabel, robotX, robotY + 62);
    }

    // ---------------------------------------------------------------------
    // scene: Spatial Intelligence
    // 3D point cloud + wireframe object + navigation path on a ground plane
    // ---------------------------------------------------------------------
    function spatialIntelligence(ctx, width, height, time, state) {
        background(ctx, width, height, palette.blue);

        const cycleLength = 12000;
        const t = (time % cycleLength) / cycleLength;
        const pulse = 0.5 + Math.sin(time * 0.004) * 0.5;

        function clamp(v, min, max) {
            return Math.max(min, Math.min(max, v));
        }

        function smooth(u) {
            u = clamp(u, 0, 1);
            return u * u * (3 - 2 * u);
        }

        function lerp(a, b, u) {
            return a + (b - a) * smooth(u);
        }

        function phase(a, b) {
            return clamp((t - a) / (b - a), 0, 1);
        }

        function perspectivePoint(relX, depth) {
            // depth: 0 = far, 1 = near
            const horizonY = height * 0.28;
            const roadBottomY = height * 0.88;
            const centerX = width * 0.5;

            const spread = lerp(width * 0.10, width * 0.46, depth);
            const y = lerp(horizonY, roadBottomY, depth);
            const x = centerX + relX * spread;

            return { x, y };
        }

        function drawObstacle(relX, depth, color) {
            const p = perspectivePoint(relX, depth);
            const s = lerp(0.35, 1.25, depth);
            const alpha = lerp(0.25, 0.95, depth);

            glow(ctx, p.x, p.y, 18 * s, color, 0.12 * alpha);

            ctx.fillStyle = 'rgba(0,0,0,' + (0.16 * alpha).toFixed(3) + ')';
            ctx.beginPath();
            ctx.ellipse(p.x, p.y + 14 * s, 18 * s, 5 * s, 0, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = color;
            ctx.globalAlpha = 0.20 * alpha;
            roundRectPath(ctx, p.x - 13 * s, p.y - 28 * s, 26 * s, 34 * s, 6 * s);
            ctx.fill();
            ctx.globalAlpha = 1;

            ctx.strokeStyle = color;
            ctx.lineWidth = 1.4 * s;
            ctx.globalAlpha = 0.65 * alpha;
            roundRectPath(ctx, p.x - 13 * s, p.y - 28 * s, 26 * s, 34 * s, 6 * s);
            ctx.stroke();
            ctx.globalAlpha = 1;

            dot(ctx, p.x, p.y - 10 * s, 3 * s, color, alpha);
        }

        function drawPathDot(depth, color, alpha) {
            const p = perspectivePoint(0, depth);
            const r = lerp(1.2, 3.8, depth);
            dot(ctx, p.x, p.y, r, color, alpha);
        }

        // -----------------------------------------------------------------
        // fake 3D space: perspective grid and road corridor
        // -----------------------------------------------------------------

        const horizonY = height * 0.28;
        const centerX = width * 0.5;

        glow(ctx, centerX, horizonY, width * 0.28, palette.cyan, 0.10);

        dot(ctx, centerX, horizonY, 2.2, palette.cyan, 0.5);

        line(ctx, centerX, horizonY, width * 0.08, height * 0.90, palette.cyan, 1, 0.28);
        line(ctx, centerX, horizonY, width * 0.92, height * 0.90, palette.cyan, 1, 0.28);

        [-0.75, -0.42, 0.42, 0.75].forEach(function (relX) {
            const far = perspectivePoint(relX, 0.05);
            const near = perspectivePoint(relX, 1.0);
            line(ctx, far.x, far.y, near.x, near.y, palette.cyan, 1, 0.14);
        });

        for (let i = 0; i < 9; i += 1) {
            const d = i / 8;
            const y = lerp(horizonY, height * 0.90, d * d);
            const left = perspectivePoint(-1, d);
            const right = perspectivePoint(1, d);
            line(ctx, left.x, y, right.x, y, palette.cyan, 1, 0.10 + d * 0.18);
        }

        // -----------------------------------------------------------------
        // robot movement: forward, detects obstacle, backs up, shifts, moves forward
        // -----------------------------------------------------------------

        let robotDepth;
        let robotOffset;

        if (t < 0.28) {
            // comes forward but stops before the yellow obstacle
            robotDepth = lerp(0.18, 0.60, phase(0.00, 0.28));
            robotOffset = lerp(-0.18, -0.06, phase(0.00, 0.28));
        } else if (t < 0.42) {
            // pause before obstacle, no collision
            robotDepth = 0.60 + Math.sin(time * 0.006) * 0.008;
            robotOffset = -0.06 + Math.sin(time * 0.004) * 0.012;
        } else if (t < 0.58) {
            // move backward
            robotDepth = lerp(0.60, 0.42, phase(0.42, 0.58));
            robotOffset = lerp(-0.06, -0.28, phase(0.42, 0.58));
        } else if (t < 0.72) {
            // shift lane
            robotDepth = 0.42;
            robotOffset = lerp(-0.28, 0.26, phase(0.58, 0.72));
        } else {
            // move forward again through safer side path
            robotDepth = lerp(0.42, 0.90, phase(0.72, 1.00));
            robotOffset = lerp(0.26, 0.14, phase(0.72, 1.00));
        }

        const robotPos = perspectivePoint(robotOffset, robotDepth);
        const robotScale = lerp(0.45, 1.35, robotDepth);

        // central path dots
        for (let i = 0; i < 12; i += 1) {
            const d = i / 11;
            drawPathDot(d, palette.gold, 0.10 + d * 0.28);
        }

        // safer bypass path
        const safePath = [
            perspectivePoint(-0.22, 0.40),
            perspectivePoint(0.05, 0.52),
            perspectivePoint(0.28, 0.68),
            perspectivePoint(0.15, 0.90)
        ];

        polyline(ctx, safePath, palette.mint, 1.5, t > 0.52 ? 0.45 : 0.14);

        // -----------------------------------------------------------------
        // obstacles at different depths
        // -----------------------------------------------------------------

        drawObstacle(-0.55, 0.30, palette.violet);
        drawObstacle(0.34, 0.48, palette.pink);

        // yellow obstacle is now ahead of the robot's first stop point
        const yellowObstacle = perspectivePoint(-0.05, 0.72);
        drawObstacle(-0.05, 0.72, palette.gold);

        drawObstacle(0.58, 0.84, palette.cyan);

        // obstacle reasoning highlight
        if (t >= 0.28 && t < 0.58) {
            ring(ctx, yellowObstacle.x, yellowObstacle.y - 12, 26 + pulse * 6, palette.gold, 0.45, 1.4);

            const node = {
                x: robotPos.x,
                y: robotPos.y - 70 * robotScale
            };

            glow(ctx, node.x, node.y, 28 + pulse * 8, palette.mint, 0.22);
            ring(ctx, node.x, node.y, 12 + pulse * 2, palette.mint, 0.8, 1.5);
            dot(ctx, node.x, node.y, 3.8, palette.mint, 0.95);

            ctx.save();
            ctx.setLineDash([4, 4]);
            line(ctx, node.x, node.y, yellowObstacle.x, yellowObstacle.y - 12, palette.gold, 1, 0.35);
            line(ctx, node.x, node.y, safePath[2].x, safePath[2].y, palette.mint, 1.3, 0.35);
            ctx.restore();
        }

        // -----------------------------------------------------------------
        // robot shadow and robot glyph
        // -----------------------------------------------------------------

        ctx.fillStyle = 'rgba(0,0,0,' + (0.12 + robotDepth * 0.12).toFixed(3) + ')';
        ctx.beginPath();
        ctx.ellipse(
            robotPos.x,
            robotPos.y + 28 * robotScale,
            24 * robotScale,
            7 * robotScale,
            0,
            0,
            Math.PI * 2
        );
        ctx.fill();

        glow(ctx, robotPos.x, robotPos.y, 30 * robotScale, palette.mint, 0.18 + robotDepth * 0.14);
        robotGlyph(ctx, robotPos.x, robotPos.y, robotScale, palette.mint, '#ffffff', 0.95);

        ring(ctx, robotPos.x, robotPos.y, 18 * robotScale + pulse * 4, palette.cyan, 0.22, 1);

        // moving perception rays
        const scanAngle = Math.sin(time * 0.003) * 0.45;
        const rayLength = 45 * robotScale;

        line(
            ctx,
            robotPos.x,
            robotPos.y,
            robotPos.x + Math.cos(-Math.PI / 2 + scanAngle) * rayLength,
            robotPos.y + Math.sin(-Math.PI / 2 + scanAngle) * rayLength,
            palette.cyan,
            1,
            0.35
        );

        line(
            ctx,
            robotPos.x,
            robotPos.y,
            robotPos.x + Math.cos(-Math.PI / 2 - scanAngle) * rayLength,
            robotPos.y + Math.sin(-Math.PI / 2 - scanAngle) * rayLength,
            palette.cyan,
            1,
            0.25
        );
    }
    
    // ---------------------------------------------------------------------
    // scene: Edge AI for Embodied Agents
    // an onboard chip inside a physical robot body, running a local loop
    // ---------------------------------------------------------------------
    function edgeEmbodied(ctx, width, height, time) {
        background(ctx, width, height, palette.violet);

        const cycleLength = 11500;
        const t = (time % cycleLength) / cycleLength;
        const pulse = 0.5 + Math.sin(time * 0.004) * 0.5;

        function clamp(v, min, max) {
            return Math.max(min, Math.min(max, v));
        }

        function smooth(u) {
            u = clamp(u, 0, 1);
            return u * u * (3 - 2 * u);
        }

        function lerp(a, b, u) {
            return a + (b - a) * smooth(u);
        }

        function phase(a, b) {
            return clamp((t - a) / (b - a), 0, 1);
        }

        // ------------------------------------------------------------
        // robot motion: server-controlled first, connection cuts,
        // then onboard edge AI takes over
        // ------------------------------------------------------------

        const groundY = height * 0.78;

        let robotX;
        let robotY = groundY - 48;

        if (t < 0.34) {
            // moving while connected to server
            robotX = lerp(width * 0.16, width * 0.43, phase(0.00, 0.34));
        } else if (t < 0.50) {
            // connection loss: short unstable pause
            robotX = width * 0.43 + Math.sin(time * 0.018) * 2.5;
            robotY = groundY - 48 + Math.sin(time * 0.022) * 1.5;
        } else if (t < 0.88) {
            // edge AI takes over and robot continues moving
            robotX = lerp(width * 0.43, width * 0.82, phase(0.50, 0.88));
        } else {
            // reset loop
            robotX = lerp(width * 0.82, width * 0.16, phase(0.88, 1.00));
        }

        const serverActive = t < 0.34;
        const cutOff = t >= 0.34 && t < 0.50;
        const edgeActive = t >= 0.50 && t < 0.88;

        const server = {
            x: width * 0.78,
            y: height * 0.22
        };

        const chip = {
            x: robotX,
            y: robotY + 5
        };

        // ------------------------------------------------------------
        // ground and movement lane
        // ------------------------------------------------------------

        line(ctx, width * 0.08, groundY, width * 0.92, groundY, palette.cyan, 1, 0.28);

        ctx.save();
        ctx.setLineDash([6, 8]);
        line(ctx, width * 0.08, groundY + 22, width * 0.92, groundY + 22, palette.cyan, 1, 0.16);
        ctx.restore();

        // small moving path dots
        for (let i = 0; i < 9; i += 1) {
            const x = width * 0.16 + i * width * 0.08;
            const active = robotX > x;
            dot(ctx, x, groundY - 8, 2.2, active ? palette.gold : palette.cyan, active ? 0.55 : 0.18);
        }

        // ------------------------------------------------------------
        // cloud/server node
        // ------------------------------------------------------------

        // small SERVER label over the server
        ctx.font = Math.max(8, Math.floor(width * 0.032)) + 'px system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = 'rgba(255,255,255,0.65)';
        ctx.fillText('Server', server.x, server.y - 30);

        glow(ctx, server.x, server.y, serverActive ? 42 + pulse * 8 : 28, palette.cyan, serverActive ? 0.25 : 0.08);

        ctx.fillStyle = serverActive ? 'rgba(84,214,255,0.18)' : 'rgba(84,214,255,0.07)';
        roundRectPath(ctx, server.x - 30, server.y - 18, 60, 36, 10);
        ctx.fill();

        ctx.strokeStyle = serverActive ? palette.cyan : 'rgba(84,214,255,0.20)';
        ctx.lineWidth = 1.5;
        roundRectPath(ctx, server.x - 30, server.y - 18, 60, 36, 10);
        ctx.stroke();

        // server rack lines
        line(ctx, server.x - 20, server.y - 6, server.x + 20, server.y - 6, palette.cyan, 1, serverActive ? 0.55 : 0.18);
        line(ctx, server.x - 20, server.y + 5, server.x + 20, server.y + 5, palette.cyan, 1, serverActive ? 0.55 : 0.18);
        dot(ctx, server.x - 19, server.y - 6, 1.8, serverActive ? palette.mint : palette.cyan, serverActive ? 0.85 : 0.20);
        dot(ctx, server.x - 19, server.y + 5, 1.8, serverActive ? palette.mint : palette.cyan, serverActive ? 0.85 : 0.20);

        // ------------------------------------------------------------
        // server connection line
        // ------------------------------------------------------------

        if (serverActive) {
            line(ctx, server.x - 30, server.y + 12, robotX + 20, robotY - 24, palette.cyan, 1.4, 0.45);

            const packet = (time * 0.00065) % 1;
            const px = lerp(server.x - 30, robotX + 20, packet);
            const py = lerp(server.y + 12, robotY - 24, packet);
            glow(ctx, px, py, 10, palette.cyan, 0.30);
            dot(ctx, px, py, 3, palette.cyan, 0.95);
        }

        if (cutOff) {
            ctx.save();
            ctx.setLineDash([5, 6]);
            line(ctx, server.x - 30, server.y + 12, robotX + 20, robotY - 24, palette.pink, 1.2, 0.22);
            ctx.restore();

            const cutX = (server.x + robotX) / 2;
            const cutY = (server.y + robotY) / 2 - 8;

            glow(ctx, cutX, cutY, 24 + pulse * 6, palette.pink, 0.22);
            line(ctx, cutX - 9, cutY - 9, cutX + 9, cutY + 9, palette.pink, 2, 0.85);
            line(ctx, cutX + 9, cutY - 9, cutX - 9, cutY + 9, palette.pink, 2, 0.85);
        }

        // ------------------------------------------------------------
        // local edge AI boundary around robot
        // ------------------------------------------------------------

        ctx.save();
        ctx.setLineDash([4, 4]);
        ctx.strokeStyle = edgeActive ? 'rgba(98,230,186,0.58)' : 'rgba(84,214,255,0.18)';
        ctx.lineWidth = edgeActive ? 1.5 : 1;
        roundRectPath(ctx, robotX - 55, robotY - 70, 110, 132, 16);
        ctx.stroke();
        ctx.restore();

        if (edgeActive) {
            glow(ctx, robotX, robotY, 58 + pulse * 12, palette.mint, 0.18 + pulse * 0.12);
        }

        // ------------------------------------------------------------
        // robot body
        // ------------------------------------------------------------

        const bodyColor = edgeActive ? palette.mint : serverActive ? palette.cyan : palette.violet;
        const eyeColor = edgeActive ? '#ffffff' : serverActive ? '#ffffff' : palette.pink;

        glow(ctx, robotX, robotY, 34, bodyColor, 0.17);
        robotGlyph(ctx, robotX, robotY, 1.22, bodyColor, eyeColor, 0.95);

        // mobile base
        ctx.fillStyle = 'rgba(255,255,255,0.08)';
        roundRectPath(ctx, robotX - 28, robotY + 34, 56, 13, 7);
        ctx.fill();

        dot(ctx, robotX - 17, robotY + 48, 4.5, bodyColor, 0.75);
        dot(ctx, robotX + 17, robotY + 48, 4.5, bodyColor, 0.75);

        // ------------------------------------------------------------
        // onboard chip
        // ------------------------------------------------------------

        ctx.fillStyle = '#0b1324';
        roundRectPath(ctx, chip.x - 15, chip.y - 11, 30, 22, 4);
        ctx.fill();

        ctx.strokeStyle = edgeActive ? palette.mint : palette.cyan;
        ctx.lineWidth = edgeActive ? 1.8 : 1.1;
        roundRectPath(ctx, chip.x - 15, chip.y - 11, 30, 22, 4);
        ctx.stroke();

        for (let i = -1; i <= 1; i += 1) {
            line(ctx, chip.x + i * 8, chip.y - 11, chip.x + i * 8, chip.y - 17, edgeActive ? palette.mint : palette.cyan, 1, edgeActive ? 0.95 : 0.5);
            line(ctx, chip.x + i * 8, chip.y + 11, chip.x + i * 8, chip.y + 17, edgeActive ? palette.mint : palette.cyan, 1, edgeActive ? 0.95 : 0.5);
        }

        // ------------------------------------------------------------
        // local sense-think-act loop when edge takes over
        // ------------------------------------------------------------

        const loopAlpha = edgeActive ? 0.75 : cutOff ? 0.35 : 0.18;
        const loopColor = edgeActive ? palette.mint : palette.cyan;
        const loopR = 29;

        ring(ctx, chip.x, chip.y, loopR, loopColor, loopAlpha * 0.45, 1.2);

        const nodes = [
            -Math.PI / 2,
            Math.PI / 6,
            Math.PI * 5 / 6
        ];

        nodes.forEach(function (a) {
            dot(ctx, chip.x + Math.cos(a) * loopR, chip.y + Math.sin(a) * loopR, 3.2, loopColor, loopAlpha);
        });

        if (edgeActive || cutOff) {
            const loopProgress = (time * 0.0013) % (Math.PI * 2);
            const px = chip.x + Math.cos(loopProgress) * loopR;
            const py = chip.y + Math.sin(loopProgress) * loopR;

            glow(ctx, px, py, 12, loopColor, edgeActive ? 0.55 : 0.25);
            dot(ctx, px, py, 3.6, loopColor, edgeActive ? 0.95 : 0.55);
        }

        // ------------------------------------------------------------
        // perception rays: weak during server mode, stronger during edge mode
        // ------------------------------------------------------------

        const scanAlpha = edgeActive ? 0.45 : serverActive ? 0.22 : 0.12;
        const scanLength = edgeActive ? 54 : 38;
        const scanAngle = Math.sin(time * 0.004) * 0.45;

        line(
            ctx,
            robotX,
            robotY,
            robotX + Math.cos(-Math.PI / 2 + scanAngle) * scanLength,
            robotY + Math.sin(-Math.PI / 2 + scanAngle) * scanLength,
            edgeActive ? palette.mint : palette.cyan,
            1,
            scanAlpha
        );

        line(
            ctx,
            robotX,
            robotY,
            robotX + Math.cos(-Math.PI / 2 - scanAngle) * scanLength,
            robotY + Math.sin(-Math.PI / 2 - scanAngle) * scanLength,
            edgeActive ? palette.mint : palette.cyan,
            1,
            scanAlpha * 0.75
        );

        // ------------------------------------------------------------
        // handover burst
        // ------------------------------------------------------------

        if (t >= 0.46 && t < 0.56) {
            const h = phase(0.46, 0.56);
            ring(ctx, chip.x, chip.y, 18 + h * 28, palette.mint, 0.55 * (1 - h), 1.8);
            ring(ctx, chip.x, chip.y, 28 + h * 34, palette.mint, 0.35 * (1 - h), 1.2);
            glow(ctx, chip.x, chip.y, 35 + h * 25, palette.mint, 0.24 * (1 - h));
        }
    }

    // ---------------------------------------------------------------------
    // scene: Data-Efficient Learning for Robotics
    // a handful of demonstrations feed a compact model that generalizes wide
    // ---------------------------------------------------------------------
    function dataEfficient(ctx, width, height, time, state) {
        background(ctx, width, height, palette.gold);

        const cycleLength = 10000;
        const t = (time % cycleLength) / cycleLength;
        const pulse = 0.5 + Math.sin(time * 0.004) * 0.5;

        function clamp(v, min, max) {
            return Math.max(min, Math.min(max, v));
        }

        function smooth(u) {
            u = clamp(u, 0, 1);
            return u * u * (3 - 2 * u);
        }

        function lerp(a, b, u) {
            return a + (b - a) * smooth(u);
        }

        // colors
        const red = '#ff4d5e';
        const green = '#62e6ba';
        const dimRed = 'rgba(255,77,94,0.18)';
        const dimGreen = 'rgba(98,230,186,0.18)';

        const midX = width * 0.5;
        const topY = height * 0.18;
        const bottomY = height * 0.82;

        // -----------------------------------------------------------------
        // split screen
        // -----------------------------------------------------------------

        line(ctx, midX, height * 0.12, midX, height * 0.88, 'rgba(255,255,255,0.18)', 1, 1);

        // left panel: traditional learning
        ctx.fillStyle = 'rgba(255,77,94,0.055)';
        roundRectPath(ctx, width * 0.06, height * 0.13, width * 0.38, height * 0.78 , 18);
        ctx.fill();

        ctx.strokeStyle = 'rgba(255,77,94,0.30)';
        ctx.lineWidth = 1.2;
        roundRectPath(ctx, width * 0.06, height * 0.13, width * 0.38, height * 0.78, 18);
        ctx.stroke();

        // right panel: efficient student-teacher learning
        ctx.fillStyle = 'rgba(98,230,186,0.055)';
        roundRectPath(ctx, width * 0.56, height * 0.13, width * 0.38, height * 0.78, 18);
        ctx.fill();

        ctx.strokeStyle = 'rgba(98,230,186,0.32)';
        ctx.lineWidth = 1.2;
        roundRectPath(ctx, width * 0.56, height * 0.13, width * 0.38, height * 0.78, 18);
        ctx.stroke();

        // -----------------------------------------------------------------
        // labels
        // -----------------------------------------------------------------

        ctx.font = Math.max(10, Math.floor(width * 0.038)) + 'px system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // ctx.fillStyle = 'rgba(255,255,255,0.75)';
        // ctx.fillText('Traditional Learning', width * 0.25, height * 0.19);

        // ctx.fillStyle = 'rgba(255,255,255,0.75)';
        // ctx.fillText('Student-Teacher Learning', width * 0.75, height * 0.19);

        ctx.font = Math.max(9, Math.floor(width * 0.033)) + 'px system-ui, sans-serif';

        ctx.fillStyle = 'rgba(255,77,94,0.85)';
        ctx.fillText('Traditional Learning', width * 0.25, height * 0.22);

        ctx.fillStyle = 'rgba(98,230,186,0.90)';
        ctx.fillText('Efficient Learning', width * 0.75, height * 0.22);

        // -----------------------------------------------------------------
        // left: traditional learning, many demonstrations, slow progress
        // -----------------------------------------------------------------

        const leftCenterX = width * 0.25;
        const leftModel = {
            x: leftCenterX,
            y: height * 0.53
        };

        // many red data dots
        for (let i = 0; i < 34; i += 1) {
            const row = Math.floor(i / 7);
            const col = i % 7;
            const x = width * 0.105 + col * width * 0.045;
            const y = height * 0.33 + row * height * 0.045;
            const delay = (i * 0.027) % 1;
            const moving = (time * 0.00012 + delay) % 1;

            dot(ctx, x, y, 2.2, red, 0.36);

            // slow data movement to model
            if (i % 4 === 0) {
                const px = lerp(x, leftModel.x, moving);
                const py = lerp(y, leftModel.y, moving);
                dot(ctx, px, py, 1.8, red, 0.45);
            }

            line(ctx, x, y, leftModel.x, leftModel.y, red, 0.6, 0.045);
        }

        // slow model core
        glow(ctx, leftModel.x, leftModel.y, 38 + pulse * 5, red, 0.16);
        ring(ctx, leftModel.x, leftModel.y, 24, red, 0.55, 1.5);
        ring(ctx, leftModel.x, leftModel.y, 15, red, 0.35, 1);
        dot(ctx, leftModel.x, leftModel.y, 7, red, 0.75);

        // slow clock / loading ring
        const slowAngle = time * 0.00045;
        arcPath(ctx, leftModel.x, leftModel.y, 34, slowAngle, slowAngle + Math.PI * 0.75, red, 0.55, 2);

        // output robot appears weak/late
        const leftRobotAlpha = 0.35 + pulse * 0.10;
        robotGlyph(ctx, leftCenterX, height * 0.73, 0.72, red, '#ffffff', leftRobotAlpha);

        // slow progress bars
        for (let i = 0; i < 4; i += 1) {
            const x = width * 0.14;
            const y = height * 0.79 + i * 5;
            const w = width * 0.22;
            const fill = ((time * 0.00005 + i * 0.18) % 1) * w;

            line(ctx, x, y, x + w, y, red, 2, 0.13);
            line(ctx, x, y, x + fill, y, red, 2, 0.45);
        }

        // -----------------------------------------------------------------
        // right: efficient student-teacher learning, fast transfer
        // -----------------------------------------------------------------

        const rightCenterX = width * 0.75;

        const teacher = {
            x: width * 0.68,
            y: height * 0.42
        };

        const student = {
            x: width * 0.82,
            y: height * 0.42
        };

        const robot = {
            x: rightCenterX,
            y: height * 0.72
        };

        // few green demonstrations
        for (let i = 0; i < 5; i += 1) {
            const x = width * 0.60 + i * width * 0.032;
            const y = height * 0.34 + Math.sin(i * 1.4) * height * 0.025;

            glow(ctx, x, y, 10, green, 0.10);
            dot(ctx, x, y, 3, green, 0.78);

            const p = (time * 0.00055 + i * 0.16) % 1;
            const px = lerp(x, teacher.x, p);
            const py = lerp(y, teacher.y, p);

            line(ctx, x, y, teacher.x, teacher.y, green, 1, 0.13);
            dot(ctx, px, py, 2.2, green, 0.75);
        }

        // teacher model
        glow(ctx, teacher.x, teacher.y, 30 + pulse * 4, green, 0.20);
        ring(ctx, teacher.x, teacher.y, 18, green, 0.70, 1.5);
        dot(ctx, teacher.x, teacher.y, 6, green, 0.88);

        // student model
        glow(ctx, student.x, student.y, 25 + pulse * 5, palette.cyan, 0.18);
        ring(ctx, student.x, student.y, 15, palette.cyan, 0.72, 1.5);
        dot(ctx, student.x, student.y, 5.2, palette.cyan, 0.88);

        // fast teacher-to-student transfer
        line(ctx, teacher.x + 18, teacher.y, student.x - 18, student.y, green, 1.8, 0.48);

        const transfer = (time * 0.00115) % 1;
        const tx = lerp(teacher.x + 18, student.x - 18, transfer);
        const ty = teacher.y + Math.sin(transfer * Math.PI) * -10;

        glow(ctx, tx, ty, 12, green, 0.35);
        dot(ctx, tx, ty, 3.5, green, 0.95);

        // fast deployment arrow to robot
        ctx.beginPath();
        ctx.moveTo(student.x, student.y + 16);
        ctx.quadraticCurveTo(rightCenterX + width * 0.05, height * 0.58, robot.x, robot.y - 28);
        ctx.strokeStyle = green;
        ctx.lineWidth = 1.7;
        ctx.globalAlpha = 0.45;
        ctx.stroke();
        ctx.globalAlpha = 1;

        const deploy = (time * 0.00095) % 1;
        const sx = (1 - deploy) * (1 - deploy) * student.x +
            2 * (1 - deploy) * deploy * (rightCenterX + width * 0.05) +
            deploy * deploy * robot.x;

        const sy = (1 - deploy) * (1 - deploy) * (student.y + 16) +
            2 * (1 - deploy) * deploy * (height * 0.58) +
            deploy * deploy * (robot.y - 28);

        dot(ctx, sx, sy, 2.8, green, 0.9);

        // capable robot, brighter and stable
        glow(ctx, robot.x, robot.y, 42 + pulse * 8, green, 0.22);
        robotGlyph(ctx, robot.x, robot.y, 0.9, green, '#ffffff', 0.95);

        // fast progress marks
        for (let i = 0; i < 5; i += 1) {
            const x = width * 0.64 + i * width * 0.055;
            const y = height * 0.80;

            ring(ctx, x, y, 6, green, 0.28, 1);
            if (((time * 0.0012 + i * 0.18) % 1) > 0.25) {
                dot(ctx, x, y, 4, green, 0.82);
            }
        }

        // -----------------------------------------------------------------
        // comparison arrows/speed hint
        // -----------------------------------------------------------------

        // red slow circular hint
        arcPath(ctx, width * 0.25, height * 0.64, 18, time * 0.00035, time * 0.00035 + Math.PI * 1.2, red, 0.38, 1.5);

        // green fast circular hint
        arcPath(ctx, width * 0.75, height * 0.62, 18, time * 0.0022, time * 0.0022 + Math.PI * 1.35, green, 0.55, 1.8);
    }

    // ---------------------------------------------------------------------
    // scene: Human-AI Agent Interaction
    // a human and a robot-like agent trade turns around a shared task
    // ---------------------------------------------------------------------

function humanAgentInteraction(ctx, width, height, time) {
    background(ctx, width, height, palette.cyan);

    const cycleLength = 11000;
    const t = (time % cycleLength) / cycleLength;
    const pulse = 0.5 + Math.sin(time * 0.004) * 0.5;

    function clamp(v, min, max) {
        return Math.max(min, Math.min(max, v));
    }

    function smooth(u) {
        u = clamp(u, 0, 1);
        return u * u * (3 - 2 * u);
    }

    function lerp(a, b, u) {
        return a + (b - a) * smooth(u);
    }

    function phase(a, b) {
        return clamp((t - a) / (b - a), 0, 1);
    }

    function mixRedToGreen(u) {
        u = smooth(u);
        const r = Math.round(255 * (1 - u) + 98 * u);
        const g = Math.round(77 * (1 - u) + 230 * u);
        const b = Math.round(94 * (1 - u) + 186 * u);
        return 'rgb(' + r + ',' + g + ',' + b + ')';
    }

    const groundY = height * 0.78;

    const human = {
        x: width * 0.28,
        y: groundY - 52
    };

    const agentNear = {
        x: width * 0.68,
        y: groundY - 52,
        s: 1
    };

    const agentFar = {
        x: width * 0.88,
        y: groundY - 70,
        s: 0.55
    };

    let agent;

    if (t < 0.28) {
        // robot comes from far to human
        const u = phase(0.00, 0.28);
        agent = {
            x: lerp(agentFar.x, agentNear.x, u),
            y: lerp(agentFar.y, agentNear.y, u),
            s: lerp(agentFar.s, agentNear.s, u)
        };
    } else if (t < 0.42) {
        // short interaction pause
        agent = {
            x: agentNear.x + Math.sin(time * 0.006) * 2,
            y: agentNear.y + Math.cos(time * 0.006) * 1.5,
            s: agentNear.s
        };
    } else if (t < 0.58) {
        // robot goes back
        const u = phase(0.42, 0.58);
        agent = {
            x: lerp(agentNear.x, agentFar.x, u),
            y: lerp(agentNear.y, agentFar.y, u),
            s: lerp(agentNear.s, agentFar.s, u)
        };
    } else if (t < 0.72) {
        // waits far
        agent = {
            x: agentFar.x + Math.sin(time * 0.004) * 2,
            y: agentFar.y,
            s: agentFar.s
        };
    } else {
        // comes again
        const u = phase(0.72, 1.00);
        agent = {
            x: lerp(agentFar.x, agentNear.x, u),
            y: lerp(agentFar.y, agentNear.y, u),
            s: lerp(agentFar.s, agentNear.s, u)
        };
    }

    let humanColor = '#ff4d5e';
    if (t >= 0.72) {
        humanColor = mixRedToGreen(phase(0.72, 1.00));
    }

    const agentColor = t >= 0.72 ? palette.mint : palette.cyan;

    // ground
    line(ctx, width * 0.08, groundY, width * 0.92, groundY, palette.cyan, 1, 0.25);

    ctx.save();
    ctx.setLineDash([6, 8]);
    line(ctx, width * 0.08, groundY + 20, width * 0.92, groundY + 20, palette.cyan, 1, 0.13);
    ctx.restore();

    // soft path from far robot to human
    ctx.save();
    ctx.setLineDash([5, 7]);
    line(ctx, agentFar.x, agentFar.y, agentNear.x, agentNear.y, agentColor, 1, 0.22);
    ctx.restore();

    // human state glow
    glow(ctx, human.x, human.y, 48 + pulse * 8, humanColor, 0.22);
    // ring(ctx, human.x, human.y - 10, 34 + pulse * 5, humanColor, 0.28, 1.2);

    // human: round head, rounded body
    dot(ctx, human.x, human.y - 5, 11, humanColor, 0.95);
    ctx.fillStyle = humanColor;
    roundRectPath(ctx, human.x - 16, human.y + 10, 32, 38, 14);
    ctx.fill();

    // // human arms
    // line(ctx, human.x - 14, human.y + 2, human.x - 30, human.y + 15, humanColor, 3, 0.75);
    // line(ctx, human.x + 14, human.y + 2, human.x + 30, human.y + 15, humanColor, 3, 0.75);

    // // human legs
    // line(ctx, human.x - 7, human.y + 28, human.x - 17, human.y + 45, humanColor, 3, 0.7);
    // line(ctx, human.x + 7, human.y + 28, human.x + 17, human.y + 45, humanColor, 3, 0.7);

    // shared task object between them
    const sharedX = lerp(human.x + 58, agent.x - 42 * agent.s, 0.5);
    const sharedY = height * 0.45 + Math.sin(time * 0.003) * 4;

    glow(ctx, sharedX, sharedY, 20 + pulse * 5, palette.gold, 0.32);
    ring(ctx, sharedX, sharedY, 8 + pulse * 1.5, palette.gold, 0.85, 1.5);
    dot(ctx, sharedX, sharedY, 3, palette.gold, 0.95);

    line(ctx, human.x + 22, human.y - 4, sharedX - 8, sharedY, palette.gold, 1.5, 0.32);
    line(ctx, agent.x - 18 * agent.s, agent.y - 8 * agent.s, sharedX + 8, sharedY, palette.gold, 1.5, 0.32);

    // communication signal when robot is near or returning
    if (t < 0.42 || t >= 0.72) {
        const signal = (time * 0.0008) % 1;
        const sx = lerp(agent.x - 16 * agent.s, human.x + 24, signal);
        const sy = lerp(agent.y - 22 * agent.s, human.y - 18, signal);

        line(ctx, agent.x - 16 * agent.s, agent.y - 22 * agent.s, human.x + 24, human.y - 18, agentColor, 1, 0.22);
        glow(ctx, sx, sy, 9, agentColor, 0.25);
        dot(ctx, sx, sy, 2.5, agentColor, 0.9);
    }

    // agent shadow
    ctx.fillStyle = 'rgba(0,0,0,' + (0.10 + agent.s * 0.08).toFixed(3) + ')';
    ctx.beginPath();
    ctx.ellipse(agent.x, agent.y + 43 * agent.s, 24 * agent.s, 7 * agent.s, 0, 0, Math.PI * 2);
    ctx.fill();

    // agent: square head, antenna, squared body
    glow(ctx, agent.x, agent.y, 46 * agent.s, agentColor, 0.20);
    ctx.fillStyle = agentColor;

    roundRectPath(ctx, agent.x - 10 * agent.s, agent.y - 32 * agent.s, 20 * agent.s, 16 * agent.s, 4 * agent.s);
    ctx.fill();

    line(ctx, agent.x, agent.y - 32 * agent.s, agent.x, agent.y - 40 * agent.s, agentColor, 2 * agent.s, 1);
    dot(ctx, agent.x, agent.y - 41 * agent.s, 2.5 * agent.s, agentColor, 0.95);

    roundRectPath(ctx, agent.x - 17 * agent.s, agent.y - 12 * agent.s, 34 * agent.s, 34 * agent.s, 6 * agent.s);
    ctx.fill();

    dot(ctx, agent.x - 5 * agent.s, agent.y - 24 * agent.s, 1.5 * agent.s, '#ffffff', 0.9);
    dot(ctx, agent.x + 5 * agent.s, agent.y - 24 * agent.s, 1.5 * agent.s, '#ffffff', 0.9);

    // dialogue bubble
    const bubbleActive = t < 0.42 || t >= 0.72;
    if (bubbleActive) {
        const isHumanTurn = Math.sin(time * 0.003) > 0;
        const speaker = isHumanTurn ? human : agent;
        const tint = isHumanTurn ? humanColor : agentColor;
        const scale = isHumanTurn ? 1 : agent.s;

        const bx = speaker.x;
        const by = isHumanTurn ? speaker.y - 40 * scale - Math.sin(time * 0.006) * 3 : speaker.y - 66 * scale - Math.sin(time * 0.006) * 3;
        const alpha = 0.45 + pulse * 0.35;

        ctx.fillStyle = 'rgba(11,19,36,' + (alpha * 0.85).toFixed(3) + ')';
        roundRectPath(ctx, bx - 17 * scale, by - 10 * scale, 34 * scale, 18 * scale, 6 * scale);
        ctx.fill();

        ctx.strokeStyle = tint;
        ctx.lineWidth = 1;
        ctx.globalAlpha = alpha;
        roundRectPath(ctx, bx - 17 * scale, by - 10 * scale, 34 * scale, 18 * scale, 6 * scale);
        ctx.stroke();
        ctx.globalAlpha = 1;

        [0, 1, 2].forEach(function (i) {
            dot(ctx, bx - 8 * scale + i * 8 * scale, by - 1 * scale, 1.6 * scale, tint, alpha);
        });
    }
}

    // ---------------------------------------------------------------------
    // topic -> scene lookup, and the per-topic deterministic state each needs
    // ---------------------------------------------------------------------

    const scenes = {
        'neuro-physics-perception': bioPerception,
        'multi-sensor-fusion': sensorFusion,
        'spatial-intelligence': spatialIntelligence,
        'edge-ai-embodied-agents': edgeEmbodied,
        'data-efficient-robotics': dataEfficient,
        'human-ai-agent-interaction': humanAgentInteraction
    };

    function makeState(topic) {
        const next = random(hash(topic));
        if (topic === 'neuro-physics-perception') {
            return { receptors: [0.28, 0.39, 0.5, 0.61, 0.72] };
        }
        if (topic === 'spatial-intelligence') {
            return {
                cloud: Array.from({ length: 26 }, function () { return { x: next(), y: next(), d: next() }; }),
                path: [
                    { x: 0.06, y: 0.94 }, { x: 0.22, y: 0.8 }, { x: 0.4, y: 0.86 },
                    { x: 0.55, y: 0.7 }, { x: 0.68, y: 0.78 }, { x: 0.8, y: 0.6 }
                ]
            };
        }
        if (topic === 'data-efficient-robotics') {
            return { demos: [0.26, 0.42, 0.58, 0.74], fan: Array.from({ length: 9 }) };
        }
        return {};
    }

    // ---------------------------------------------------------------------
    // canvas lifecycle (unchanged: resize handling, rAF loop, visibility)
    // ---------------------------------------------------------------------

    function startCanvas(canvas) {
        const topic = canvas.getAttribute('data-topic');
        const draw = scenes[topic];
        if (!draw) return null;
        const context = canvas.getContext('2d');
        const state = makeState(topic);
        let width = 0, height = 0, active = true, frameId = null;

        function resize() {
            const bounds = canvas.getBoundingClientRect();
            const ratio = Math.min(window.devicePixelRatio || 1, 2);
            width = Math.max(1, Math.round(bounds.width));
            height = Math.max(1, Math.round(bounds.height));
            canvas.width = Math.round(width * ratio);
            canvas.height = Math.round(height * ratio);
            context.setTransform(ratio, 0, 0, ratio, 0, 0);
        }

        function render(time) {
            draw(context, width, height, time, state);
            if (!reduceMotion && active) frameId = window.requestAnimationFrame(render);
        }

        resize();
        if (reduceMotion) render(0);
        else frameId = window.requestAnimationFrame(render);
        window.addEventListener('resize', resize, { passive: true });

        return function (visible) {
            active = visible;
            if (visible && !reduceMotion && !frameId) frameId = window.requestAnimationFrame(render);
            if (!visible && frameId) { window.cancelAnimationFrame(frameId); frameId = null; }
        };
    }

    window.ResearchCanvases = {
        start: function (container) {
            const canvases = container.querySelectorAll('.research-topic-canvas');
            const controls = Array.prototype.map.call(canvases, startCanvas);
            if (!('IntersectionObserver' in window)) return;
            const observer = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    const index = Array.prototype.indexOf.call(canvases, entry.target);
                    if (controls[index]) controls[index](entry.isIntersecting);
                });
            }, { rootMargin: '120px 0px' });
            Array.prototype.forEach.call(canvases, function (canvas) { observer.observe(canvas); });
        }
    };
}());
