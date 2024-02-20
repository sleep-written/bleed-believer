import { EventDetail } from './entities/event-detail.entity.js';
import { Character } from './entities/character.entity.js';
import { Event } from './entities/event.entity.js';

export async function deploySeeds(): Promise<void> {
    if (await Character.count() > 0) {
        return;
    }

    const charA = new Character();
    charA.name = 'Stella Fairchild';
    await charA.save();
    
    const charB = new Character();
    charB.name = 'Emily Nihei';
    await charB.save();

    const event1 = new Event();
    event1.title = 'Meet';
    event1.description = 'Emily and Stella made friends';
    await event1.save();

    const detail1 = new EventDetail();
    detail1.event = event1;
    detail1.character = charA;
    detail1.description = 'She saw a girl making a drawing.'
    await detail1.save();

    const detail2 = new EventDetail();
    detail2.event = event1;
    detail2.character = charB;
    detail2.description = 'She was drawing.';
    await detail2.save();

    const event2 = new Event();
    event2.title = 'AKIRA';
    event2.description = 'Emily and Stella watches the AKIRA movie together';
    await event2.save();

    const detail3 = new EventDetail();
    detail3.event = event2;
    detail3.character = charA;
    detail3.description = 'She was go to the Emily\'s house.'
    await detail3.save();

    const detail4 = new EventDetail();
    detail4.event = event2;
    detail4.character = charB;
    detail4.description = 'She invites Stella to visit her home.';
    await detail4.save();
}