import { Importers } from '/app/importer';
import { SlackImporterInfo } from '../lib/info';
import { SlackImporter } from './importer';

Importers.add(new SlackImporterInfo(), SlackImporter);
