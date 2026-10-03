#!/usr/bin/env node
/** Existing data integrity gate, extended with numeric, range and reference invariants. */
import { PARTS } from '../src/data/parts';
import { CHASSIS_LIST } from '../src/data/chassis';
import { ROADS } from '../src/data/roads';
import { validateData } from './dataValidation';

const checks = validateData(PARTS, CHASSIS_LIST, ROADS);
for (const check of checks) (check.passed ? console.log : console.error)((check.passed ? 'PASS ' : 'FAIL ') + check.label);
const failures = checks.filter(check => !check.passed);
console.log(checks.length + ' checks; ' + failures.length + ' failures');
process.exitCode = failures.length === 0 ? 0 : 1;
