import path from 'path';
import { FileSys } from './FileSys';
import {
  FileExtension,
  getCommandName,
  getSlashCommandName,
  Initializer,
  Language,
  getEventName,
} from './utils/index';
import {
  getBaseCommand,
  getBaseCommandTS,
  getBaseSlashCommand,
  getBaseSlashCommandTS,
  getBaseEvent,
  getBaseEventTS,
  getCommandTemplate,
  getCommandTemplateTS,
  getSlashCommandTemplate,
  getSlashCommandTemplateTS,
  getMessageEvent,
  getMessageEventTS,
  getInteractionEvent,
  getInteractionEventTS,
  getReadyEvent,
  getReadyEventTS,
  getRegistryFile,
  getRegistryFileTS,
  getTestCommand,
  getTestCommandTS,
  getTestSlashCommand,
  getTestSlashCommandTS,
  getTypescriptBotFile,
} from './templates/templates';
import { SimpleLogger } from './Logger';
import { Logger, ProjectTemplateGenerator } from './utils/interfaces';
import eventTemplates from './templates/events';
import eventTemplatesTS from './templates/tsevents';

const eventsJS: any = eventTemplates;
const eventsTS: any = eventTemplatesTS;

export class TemplateGenerator
  implements ProjectTemplateGenerator, Initializer
{
  private static instance: TemplateGenerator;

  private fileSys: FileSys = FileSys.getFileSystem();

  private logger: SimpleLogger = SimpleLogger.getSimpleLogger();

  private language: Language | undefined;

  async initialize(language?: Language) {
    this.language = language;
  }

  async generateUtilities(srcPath: string) {
    const { utils, structures, test, ready, message, client, interaction } =
      this.getPaths(srcPath);
    await this.generateDirectories(srcPath);
    await this.generateRegistry(utils);
    if (this.language === 'typescript') await this.generateClient(client);
    await this.generateBaseCommand(structures);
    await this.generateBaseSlashCommand(structures);
    await this.generateBaseEvent(structures);
    await this.generateTestCommand(test);
    await this.generateTestSlashCommand(test);
    await this.generateReadyEvent(ready);
    await this.generateMessageEvent(message);
    await this.generateInteractionEvent(interaction);
  }

  getPaths(srcPath: string) {
    const utils = path.join(srcPath, 'utils');
    const structures = path.join(utils, 'structures');
    const commands = path.join(srcPath, 'commands');
    const slashCommands = path.join(srcPath, 'slashCommands');
    const events = path.join(srcPath, 'events');
    const client = path.join(srcPath, 'client');
    const test = path.join(commands, 'test');
    const slashtest = path.join(slashCommands, 'test');
    const ready = path.join(events, 'ready');
    const message = path.join(events, 'message');
    const interaction = path.join(events, 'interaction');
    return {
      commands,
      slashCommands,
      utils,
      structures,
      slashtest,
      test,
      ready,
      message,
      interaction,
      events,
      client,
    };
  }

  async generateClient(filePath: string) {
    const template = getTypescriptBotFile();
    const file = path.join(filePath, 'client.ts');
    await this.fileSys.createFile(file, template);
  }

  async generateDirectories(basePath: string) {
    const {
      utils,
      structures,
      commands,
      slashCommands,
      interaction,
      events,
      slashtest,
      test,
      ready,
      client,
      message,
    } = this.getPaths(basePath);
    this.logger.info('Generating Directories...');
    await this.fileSys.createDirectory(utils);
    this.logger.success('Created Utilities Directory');
    await this.fileSys.createDirectory(structures);
    this.logger.success('Created Structures Directory');
    if (this.language === 'typescript') {
      await this.fileSys.createDirectory(client);
      this.logger.success('Created Client Directory');
    }
    await this.fileSys.createDirectory(commands);
    this.logger.success('Created Commands Directory');
    await this.fileSys.createDirectory(slashCommands);
    this.logger.success('Created Slash Commands Directory');
    await this.fileSys.createDirectory(events);
    this.logger.success('Created Events Directory');
    await this.fileSys.createDirectory(test);
    this.logger.success('Created TestCommand Directory');
    await this.fileSys.createDirectory(slashtest);
    this.logger.success('Created TestSlashCommand Directory');
    await this.fileSys.createDirectory(ready);
    this.logger.success('Created ReadyEvent Directory');
    await this.fileSys.createDirectory(message);
    this.logger.success('Created MessageEvent Directory');
    await this.fileSys.createDirectory(interaction);
    this.logger.success('Created InteractionEvent Directory');
  }

  async generateRegistry(filePath: string) {
    const isJs = this.language === 'javascript';
    const template = isJs ? getRegistryFile() : getRegistryFileTS();
    const extension: FileExtension = isJs ? 'js' : 'ts';
    const file = path.join(filePath, `registry.${extension}`);
    return this.fileSys.createFile(file, template);
  }

  async generateBaseCommand(filePath: string) {
    const isJs = this.language === 'javascript';
    const template = isJs ? getBaseCommand() : getBaseCommandTS();
    const extension: FileExtension = isJs ? 'js' : 'ts';
    const file = path.join(filePath, `BaseCommand.${extension}`);
    await this.fileSys.createFile(file, template);
  }

  async generateBaseSlashCommand(filePath: string) {
    const isJs = this.language === 'javascript';
    const template = isJs ? getBaseSlashCommand() : getBaseSlashCommandTS();
    const extension: FileExtension = isJs ? 'js' : 'ts';
    const file = path.join(filePath, `BaseSlashCommand.${extension}`);
    await this.fileSys.createFile(file, template);
  }

  async generateBaseEvent(filePath: string) {
    const isJs = this.language === 'javascript';
    const template = isJs ? getBaseEvent() : getBaseEventTS();
    const extension: FileExtension = isJs ? 'js' : 'ts';
    const file = path.join(filePath, `BaseEvent.${extension}`);
    await this.fileSys.createFile(file, template);
  }

  async generateTestCommand(filePath: string) {
    const isJs = this.language === 'javascript';
    const template = isJs ? getTestCommand() : getTestCommandTS();
    const extension: FileExtension = isJs ? 'js' : 'ts';
    const file = path.join(filePath, `TestCommand.${extension}`);
    await this.fileSys.createFile(file, template);
  }

  async generateTestSlashCommand(filePath: string) {
    const isJs = this.language === 'javascript';
    const template = isJs ? getTestSlashCommand() : getTestSlashCommandTS();
    const extension: FileExtension = isJs ? 'js' : 'ts';
    const file = path.join(filePath, `TestSlashCommand.${extension}`);
    await this.fileSys.createFile(file, template);
  }

  async generateReadyEvent(filePath: string) {
    const isJs = this.language === 'javascript';
    const template = isJs ? getReadyEvent() : getReadyEventTS();
    const extension: FileExtension = isJs ? 'js' : 'ts';
    const file = path.join(filePath, `ReadyEvent.${extension}`);
    await this.fileSys.createFile(file, template);
  }

  async generateMessageEvent(filePath: string) {
    const isJs = this.language === 'javascript';
    const template = isJs ? getMessageEvent() : getMessageEventTS();
    const extension: FileExtension = isJs ? 'js' : 'ts';
    const file = path.join(filePath, `MessageEvent.${extension}`);
    await this.fileSys.createFile(file, template);
  }

  async generateInteractionEvent(filePath: string) {
    const isJs = this.language === 'javascript';
    const template = isJs ? getInteractionEvent() : getInteractionEventTS();
    const extension: FileExtension = isJs ? 'js' : 'ts';
    const file = path.join(filePath, `InteractionEvent.${extension}`);
    await this.fileSys.createFile(file, template);
  }

  async generateCommand(categoryPath: string, name: string, category: string) {
    if (!this.language) throw new Error('Language was not set');
    const fileName = getCommandName(name, this.language);
    const filePath = path.join(categoryPath, fileName);
    const exists = await this.fileSys.exists(filePath);
    if (!exists) {
      const isJs = this.language === 'javascript';
      const template = isJs
        ? getCommandTemplate(name, category)
        : getCommandTemplateTS(name, category);
      return this.fileSys.createFile(filePath, template);
    }
    throw new Error(`${filePath} already exists.`);
  }

  async generateSlashCommand(categoryPath: string, name: string, category: string) {
    if (!this.language) throw new Error('Language was not set');
    const fileName = getSlashCommandName(name, this.language);
    const filePath = path.join(categoryPath, fileName);
    const exists = await this.fileSys.exists(filePath);
    if (!exists) {
      const isJs = this.language === 'javascript';
      const template = isJs
        ? getSlashCommandTemplate(name, category)
        : getSlashCommandTemplateTS(name, category);
      return this.fileSys.createFile(filePath, template);
    }
    throw new Error(`${filePath} already exists.`);
  }

  async generateEvents(events: any[], eventsDir: string) {
    if (!this.language) throw new Error('Language was not set');
    for (const event of events) {
      const fileName = getEventName(event, this.language);
      const filePath = path.join(eventsDir, fileName);
      const exists = await this.fileSys.exists(filePath);
      const template = this.getTemplate(event);
      if (!exists) {
        await this.fileSys.createFile(filePath, template);
      }
    }
  }

  getTemplate(event: string) {
    return this.language === 'javascript' ? eventsJS[event] : eventsTS[event];
  }

  static getTemplateGenerator(): TemplateGenerator {
    if (!TemplateGenerator.instance) {
      TemplateGenerator.instance = new TemplateGenerator();
    }
    return TemplateGenerator.instance;
  }

  public getfileSys(): FileSys {
    return this.fileSys;
  }

  public getLogger(): Logger {
    return this.logger;
  }

  public getLanguage(): Language | undefined {
    return this.language;
  }
}
