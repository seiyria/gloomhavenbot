import { AutoWired, Singleton } from 'typescript-ioc';
import * as YAML from 'yamljs';
import { uniqBy } from 'lodash';
import { FuzzySetContainer } from 'fuzzyset-obj';

import { BaseService } from '../base/BaseService';

interface IAbility {
  name: string;
  char: string;
  level: string;
  longImage: string;
  image: string;
}

@Singleton
@AutoWired
export class AbilityService extends BaseService {

  private gloomCards: IAbility[] = [];
  private gloomAbilities: FuzzySetContainer<IAbility> = new FuzzySetContainer<IAbility>({ key: '_key' });

  public async init(client) {
    super.init(client);

    this.loadAll();
  }

  public getGloomAbility(name: string): IAbility {
    try {
      return this.gloomAbilities.getFirst(name);
    } catch {
      return null;
    }
  }

  public getGloomAbilitiesByCharacter(char: string): IAbility[] {
    return uniqBy(this.gloomCards.filter((c) => c.char === char), (x) => x.name);
  }

  public getGloomAbilitiesByCharacterLevel(char: string, level: string): IAbility[] {
    return this.getGloomAbilitiesByCharacter(char).filter((c) => c.level === level);
  }

  private loadAll() {
    ['Gloomhaven', 'JOTL'].forEach((game) => {
      const cards = YAML.load(`assets/${game.toLowerCase()}/abilities.yml`);

      cards.forEach((card) => {

        card.level = card.level.toString().toLowerCase();
        card.longImage = `assets/${game.toLowerCase()}/images/characters/${card.char}/${card.image}`;

        const nameRef = Object.assign({ _key: card.name }, card);

        this.gloomAbilities.add(nameRef);
        this.gloomCards.push(card);
      });
    });
  }

}
