/**
 * @typedef ExportObject
 * @property {string?} types
 * @property {string?} import
 * @property {string?} require
 * @property {string?} node
 * @property {string?} default
 */

/** @typedef {(string|ExportObject)} ExportEntry */

/** @typedef {('effector'|'effector-react'|'effector-vue'|'effector-solid'|'forest')} ItemKey */

/**
 * @typedef FileOverview
 * @property {string} ext
 * @property {string} file
 * @property {boolean} declaration
 */

/**
 * @typedef ExportOverview
 * @property {FileOverview[]} extensions
 * @property {file} string
 * @property {boolean} declaration
 */

const path   = require('path');
const os     = require('os');
const fs     = require('fs');
const assert = require('assert');

const rootDir = path.resolve(__dirname, 'effector')

/** @type {Record<ItemKey, ExportEntry>} */
const items = {
  effector: {
    '.': {
      types: './index.d.ts',
      import: './effector.mjs',
      require: './effector.cjs.js',
      default: './effector.mjs',
    },
    './effector.mjs': {
      types: './effector.mjs.d.ts',
      import: './effector.mjs',
      default: './effector.mjs',
    },
    './fork': {
      types: './fork.d.ts',
      import: './fork.mjs',
      require: './fork.js',
      default: './fork.mjs',
    },
    './compat': {
      types: './compat.d.ts',
      require: './compat.js',
      default: './compat.js',
    },
    './effector.umd': {
      types: './effector.umd.d.ts',
      default: './effector.umd.js',
    },
    './babel-plugin': './babel-plugin.js',
    './babel-plugin-react': './babel-plugin-react.js',
    './package.json': './package.json',
  },
  'effector-react': {
    '.': {
      types: './index.d.ts',
      import: './effector-react.mjs',
      require: './effector-react.cjs.js',
      default: './effector-react.mjs',
    },
    './package.json': './package.json',
    './effector-react.mjs': {
      types: './effector-react.mjs.d.ts',
      import: './effector-react.mjs',
      default: './effector-react.mjs'
    },
    './scope.mjs': {
      types: './scope.d.ts',
      import: './scope.mjs',
      default: './scope.mjs'
    },
    './scope': {
      types: './scope.d.ts',
      import: './scope.mjs',
      require: './scope.js',
      default: './scope.mjs',
    },
    './ssr': {
      types: './ssr.d.ts',
      import: './ssr.mjs',
      require: './ssr.js',
      default: './ssr.mjs',
    },
    './compat': {
      types: './compat.d.ts',
      require: './compat.js',
      default: './compat.js'
    },
    './effector-react.umd': {
      types: './effector-react.umd.d.ts',
      require: './effector-react.umd.js',
      default: './effector-react.umd.js'
    },
  },
  'effector-solid': {
    '.': {
      types: './index.d.ts',
      import: './effector-solid.mjs',
      require: './effector-solid.cjs.js',
      default: './effector-solid.mjs',
    },
    './package.json': './package.json',
    './effector-solid.mjs': {
      types: './effector-solid.mjs.d.ts',
      import: './effector-solid.mjs',
      default: './effector-solid.mjs'
    },
    './scope.mjs': {
      types: './scope.d.ts',
      import: './scope.mjs',
      default: './scope.mjs'
    },
    './scope': {
      types: './scope.d.ts',
      import: './scope.mjs',
      require: './scope.js',
      default: './scope.mjs',
    },
    './effector-solid.umd': {
      types: './effector-solid.umd.d.ts',
      require: './effector-solid.umd.js',
      default: './effector-solid.umd.js'
    },
  },
  'effector-vue': {
    '.': {
      types: './index.d.ts',
      import: './effector-vue.mjs',
      require: './effector-vue.cjs.js',
      default: './effector-vue.mjs',
    },
    './composition': {
      types: './composition.d.ts',
      import: './composition.mjs',
      require: './composition.cjs.js',
      default: './composition.mjs',
    },
    './ssr': {
      types: './ssr.d.ts',
      import: './ssr.mjs',
      require: './ssr.cjs.js',
      default: './ssr.mjs',
    },
    './effector-vue.mjs': {
      types: './effector-vue.mjs.d.ts',
      import: './effector-vue.mjs',
      default: './effector-vue.mjs'
    },
    './composition.mjs': {
      types: './composition.mjs.d.ts',
      import: './composition.mjs',
      default: './composition.mjs'
    },
    './ssr.mjs': {
      types: './ssr.mjs.d.ts',
      import: './ssr.mjs',
      default: './ssr.mjs'
    },
    './compat': {
      types: './compat.d.ts',
      require: './compat.js',
      default: './compat.js'
    },
    './effector-vue.umd': {
      types: './effector-vue.umd.d.ts',
      require: './effector-vue.umd.js',
      default: './effector-vue.umd.js'
    },
  },
  forest: {
    './package.json': './package.json',
    '.': {
      types: './index.d.ts',
      import: './forest.mjs',
      require: './forest.cjs.js',
      default: './forest.mjs',
    },
    './forest.mjs': {
      types: './forest.mjs.d.ts',
      import: './forest.mjs',
      default: './forest.mjs'
    },
    './server': {
      types: './server.d.ts',
      import: './server.mjs',
      require: './server.js',
      default: './server.mjs',
    },
    './forest.umd': {
      types: './forest.umd.d.ts',
      require: './forest.umd.js',
      default: './forest.umd.js'
    },
  },
}


const paths = Object.keys(items).map(a => [ a, path.resolve(rootDir, a) ]);


/**
 * @param {string} basename
 * @returns {FileOverview}
 */
function fileOverview(_, basename) {
  const [ file, ...extParts ]= basename.split('.');
  const ext = '.' + extParts.join('.');
  return { ext, file, declaration: ext.includes('.d.ts') };
}

/**
 * @summary lacks`fileName${['exportType', 'expectedValue']}`
 * @param {key} exportKey
 * @param {[ kind: string, expected: string, actually: string, fallback?: string ]} obj
 */
function lacks(arg, [ kind, expected, actually, fallback ]) {
  const exportKey = (typeof arg === 'string' ? arg : arg[0]) || fallback || '';
  return `${exportKey} lacks "${kind}": "${expected}", found ${actually}`.trim();
}

/**
 * @param {(string|string[])} arg
 * @param {[ rootDir: string, fallbackKey?: string ]} params
 * @returns {string} A valid .d.ts file that exists
 */
const decl = (arg, [rootDir, fallbackKey]) => {
  const key = (typeof arg === 'string' ? arg : arg[0]) || fallbackKey || '';
  if (!key) return '';

  const { file, declaration, ext } = fileOverview`${key}`;

  // leading .
  const firstExt = ext.split('.')[1]

  const attempts =
    [`${key}.d.ts`, `${file}.d.ts`, `${file}.${firstExt}.d.ts`]
      .filter(a => !a.includes('..'));

  // if we're literally given a declaration
  if (declaration && fs.existsSync(path.resolve(rootDir, key))) {
    return key;
  } else if (declaration) {
    throw new Error(`${rootDir} does not contain ${key}`);
  }

  for (const seek of attempts) {
    if (!fs.existsSync(path.resolve(rootDir, seek))) {
      continue
    }

    return seek;
  }

  const attempted = attempts.map(a => `  - ${a}`);
  throw new Error(`No .d.ts for ${key} exists in ${rootDir}.\nAttempts:\n${attempted}`);
};

// For every entry, make sure we have what we want
for (const [ pkgKey, pkgDir ] of paths) {
  // Get a reference to the specific package we want to check
  const pkg = items[pkgKey];
  // Get the files that are in the `npm` directory of the package
  const dirFiles = fs.readdirSync(pkgDir);

  // Save all the files referenced? 
  /** @type {Map<string, ExportOverview>} */
  const files = new Map();
  const badExtensions = /^\.(json|map|md|)$/;
  for (const f of dirFiles) {
    const basename = path.basename(f);
    const { ext, file, declaration } = fileOverview`${basename}`
    // no maps or irrelevant extensions
    if (badExtensions.test(ext) | ext.includes('map')) continue;

    // get or create a file overview for checking later
    const overview = files.get(file) ?? { extensions: [], file, declaration };
    if (declaration && declaration != overview.declaration) {
      overview.declaration = true;
    }

    // update the extensions to include this -- safe because same name + extension = same file
    // which is not possible to have duplicates
    overview.extensions.push(ext);

    files.set(file, overview);
  }

  /** @type {[ exportKey: string, layout: ExportEntry ][]} */
  const entries = Object.entries(pkg);
  for (const [ exportKey, layout ] of entries) {
    if (typeof layout === 'string') continue;

    const indexType = './index.d.ts';
    const modImport = `./${pkgKey}.mjs`;
    const modType   = `${modImport}.d.ts`;
    const cjsImport = `./${pkgKey}.cjs.js`;

    // check that _all_ entries for this package export layout exist on the file system
    for (const [ key, val ] of Object.entries(layout)) {
      // remove ./ from val
      const check = val.slice(2)
      const hasFileHint = `('${exportKey}' -> '${key}')`
      const hasFileErr  = `Dir ${pkgDir} does not contain ${check}`;
      const hasFile     = dirFiles.includes(check);
      assert(hasFile, `${hasFileErr} ${hasFileHint}`);

      // check that we're not making test mistakes
      const fullPath   = path.resolve(pkgDir, check);
      const fileExists = fs.existsSync(fullPath);
      assert(fileExists, `File at path ${fullPath} does not exist`);
    }

    // check main package export
    if (exportKey === '.') {
      assert(layout.types === indexType, lacks`.${["types", "./index.d.ts", layout.types]}`);
      assert(layout.import === modImport, lacks`.${["import", modImport, layout.import]}`);
      assert(layout.require === cjsImport, lacks`.${["require", cjsImport, layout.require]}`);
      assert(layout.default === layout.import, lacks`.${[ 'default', modImport, layout.default]}`);
      continue;
    }

    // check _named_ package-specific export -- './effector.mjs', './effector-react.mjs', etc.
    // These always have .cjs.d.ts or .mjs.d.ts
    if (exportKey.includes(`${pkgKey}.mjs`)) {
      assert(layout.types === modType, lacks`${[ 'types', modType, layout.types, modImport ]}`);
      assert(layout.import == modImport, lacks`${[ 'import', modImport, layout.import, modImport ]}`);
      assert(layout.default === modImport, lacks`${[ 'default', modImport, layout.default, modImport ]}`);
      continue;
    }

    const typesFile = decl`${[pkgDir, exportKey]}`;

    // assert that the type file exists
    assert(layout.types === typesFile, lacks`${['types', typesFile, layout.types, exportKey]}`);
  }
}

console.log('Type files for everything exists as expected');
