# Starting School Game

Stage 1: start screen through to the scrolling classroom.

## Run it on your computer

1. Open Terminal in this folder.
2. Type `npm install` and wait for it to finish (first time only).
3. Type `npm run dev`.
4. Open http://localhost:3000 in your browser.
5. Live version at https://www.copingwithgrowing.com/play-starting-school.html

## Handy tricks

- Add `?scene=classroom` to the address to jump straight to a scene.
  Scenes: start, make, photo, walk, peg, tray, bottle, door, register, classroom, end.
- Add `?debug` to see the tap areas as pink boxes.
- `npm test` runs the light tests.

## Where things live

- `public/img` : the artwork. Replace a file with the same name to swap the art.
- `public/video` : walk-girl.mp4 and walk-boy.mp4. The skirt choice picks the girl film, everything else picks the boy film.
- `components/Game.tsx` : the order of the day and the simple tap scenes.
- `components/Maker.tsx` and `components/Avatar.tsx` : the character maker and the character drawing.
- `components/Classroom.tsx` : the scrolling room and its tap areas (the SPOTS list).
- `components/activities.tsx` : paint, build, puzzle, calm jar, tell the time.
- `lib/scenes.ts` : scene order and the "Talk about it" prompts.

Nothing about the child is saved or sent anywhere.

## Deploy on Vercel
The easiest way to deploy your Next.js app is to use the Vercel Platform from the creators of Next.js.

Check out our Next.js deployment documentation for more details.
