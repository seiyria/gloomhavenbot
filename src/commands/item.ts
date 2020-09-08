
import { Inject } from 'typescript-ioc';
import * as Discord from 'discord.js';

import { ICommand, ICommandArgs, ICommandResult } from '../interfaces';
import { PresenceService } from '../services/presence';
import { ItemService } from '../services/item';
import { TextParserService } from '../services/text-parser';

export class ItemCommand implements ICommand {

  help = `Display an item! Do \`!item #001\` or \`!item boots of striding\` to search for the Boots of Striding item. **WARNING**: Embedded images can\'t be spoiler-hidden at this time.`;

  aliases = ['item', 'itemg', 'itemf', 'itemj'];

  @Inject private itemService: ItemService;
  @Inject private presenceService: PresenceService;
  @Inject private textParserService: TextParserService;

  async execute(cmdArgs: ICommandArgs): Promise<ICommandResult> {
    const { message, args } = cmdArgs;

    const card = this.itemService.getGloomItem(args);
    if (!card) {
      message.channel.send(`Sorry! I could not find anything like "${args}"`);
      return;
    }

    const attachFiles = [
      {
        attachment: card.longImage,
        name: `SPOILER_${card.image}`
      }
    ];

    const embed = new Discord.RichEmbed()
      .attachFiles(attachFiles)
      .setAuthor(`Item #${card.num.toString().padStart(3, '0')}`)
      .setThumbnail(`attachment://SPOILER_${card.image}`);

    embed.addField('Name', this.formatTextForSpoiler(card, card.name));

    if (card.source) {
      embed.addField('Source', this.formatTextForSpoiler(card, this.textParserService.formatTextForEmojis(card.source)));
    }

    this.presenceService.setPresence(`with ${card.name}`);

    message.channel.send({ embed });

    return { };
  }

  private formatTextForSpoiler(card, text): string {
    if (card.isSpoiler) { return `||${text}||`; }
    return text;
  }

}
