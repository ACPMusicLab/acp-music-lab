# ACP Music Lab v2 — implementation plan

## Product boundary
Music Lab is for children aged 4–5 **with a teacher present at all times**. The teacher directs learning, judges mastery, and can stop or repeat any activity. Student accounts, homework, independent instruction and automated assessment belong to the future Grade 1 product.

## Release approach
- Work on branch `development/music-lab-v2`; do not alter live `main` until approved.
- Use Unit 3 as the reference implementation. Validate it on iPad before migrating Units 1–5 and Review 1.
- Check that sound, notation, progress and replay work after each migration.

## 1. Shared exercise engine
- Centralise staff/note rendering, unbiased Fisher–Yates shuffling, sound dispatch, question state, and rewards.
- Correct: notehead/stem green briefly; then advance automatically.
- Incorrect: notehead/stem flash red, return to original colour, permit retry; no penalty.
- One golden quaver per correct answer; one golden star per completed exercise.
- Independent unlimited replay; cancel pending timers on restart; avoid duplicate listeners and shared MutationObserver loops.
- Preserve each exercise's intended note distribution and distinguish teaching from assessment.

## 2. Focus Mode
- One prominent question and large touch targets, with no redundant navigation while focused.
- Teacher can exit, restart, choose length, show/hide reference notes; accessible from every activity.
- Maintain screen orientation and scroll position where practical. Keyboard and touch accessible.

## 3. Piano audio
- Replace oscillator approximation with licensed or original recorded piano samples for all required pitches.
- Same note and volume across all activities; low-latency playback on iPad; mute/unmute.
- Sound plays for all note taps, including incorrect choices; avoid celebratory audio masking pitch.
- Do not publish third-party recordings without appropriate rights.

## 4. Treble-clef drawing
- Watch demonstration; Trace guide; independent drawing (optional).
- Clear drawing without awarding; teacher accepts a developmentally appropriate attempt.
- No rigid shape test as sole arbiter; drawing is not a compulsory mastery gate for ages 4–5.
- Validate Apple Pencil and finger input on iPad.

## 5. Teacher-controlled exercise length
- 5 or 10 questions (default 10); balanced sampling and unbiased shuffle, repeats allowed.
- Each replay generates a fresh sequence and resets only the current attempt.
- Teacher can stop early without failure or losing access to other exercises.

## 6. Visual identity
- Use **the approved fox artwork**, not emoji or an invented substitute. Obtain an accessible source asset before integrating.
- Standardise typography, note geometry, touch targets, gold quavers and stars.
- Keep the interface calm; restrained completion animation, no distracting effects.

## Acceptance criteria before merge
- Unit 3 reference game tested on an actual iPad: correct/incorrect colours, sound, 5/10 lengths, focus mode, replay and restart during pending feedback.
- Exercises in Units 1–5 and Review 1 can be repeated without refreshing the page.
- Music notation is accurate (including C ledger line); rewards count correctly; completion only after actual completion.
- Teacher controls remain available and no student login/homework flow appears.
- Original approved fox asset and legally usable piano samples are available before those features are marked complete.
- Regression tests on mobile Safari and desktop; teacher-led observation with children before classroom release.

## Work status
- [x] Create separate development branch.
- [ ] Implement shared engine in Unit 3.
- [ ] Implement Focus Mode.
- [ ] Add recorded piano audio.
- [ ] Redesign treble-clef drawing.
- [ ] Add 5/10 teacher selection.
- [ ] Integrate approved fox.
- [ ] Migrate remaining units and Review 1.
- [ ] Test and approve merge to main.
