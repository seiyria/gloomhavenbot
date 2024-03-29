
import { AutoWired, Singleton, Inject } from 'typescript-ioc';
import { BaseService } from '../base/BaseService';
import { EnvService } from './env';

@Singleton
@AutoWired
export class PresenceService extends BaseService {

  @Inject private envService: EnvService;

  public async init(client) {
    super.init(client);

    if (this.envService.ignorePresence) { return; }
    this.setPresence('with Gloomhaven; !ghelp');
  }

  public setPresence(presence: string) {
    this.client.user.setPresence({ activity: { name: presence } });
  }
}
