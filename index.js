#!/usr/bin/env node
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define("cli/index", ["require", "exports", "commander", "chalk", "./migrate"], function (require, exports, commander, chalk_1, migrate_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    commander.version('0.0.1');
    commander
        .command('migrate <m>', 'Run firestore migration')
        .action((c, m) => migrate_1.migrate(m));
    commander.parse(process.argv);
    if (!process.argv.slice(2).length) {
        commander.outputHelp(chalk_1.default.red);
    }
});
define("cli/migrate/index", ["require", "exports", "firebase-admin", "../../types"], function (require, exports, admin, types_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function migrate(migration) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('migrate', migration);
            const postsSnapshots = yield admin
                .firestore()
                .collection('posts')
                .get();
            const posts = postsSnapshots.docs.map(d => types_1.mapDocument(d));
            console.table(posts);
        });
    }
    exports.migrate = migrate;
});
//# sourceMappingURL=index.js.map