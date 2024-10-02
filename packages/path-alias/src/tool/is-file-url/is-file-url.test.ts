import test from 'ava';
import { isFileUrl } from './is-file-url.js';

// URLs válidas de tipo file:
test('should return true for a standard file URL', t => {
    const specifier = 'file:///path/to/file.txt';
    t.true(isFileUrl(specifier));
});

test('should return true for a file URL with localhost', t => {
    const specifier = 'file://localhost/path/to/file.txt';
    t.true(isFileUrl(specifier));
});

test('should return true for a Windows-style file URL', t => {
    const specifier = 'file:///C:/path/to/file.txt';
    t.true(isFileUrl(specifier));
});

// URLs no pertenecientes al protocolo file:
test('should return false for an HTTP URL', t => {
    const specifier = 'http://example.com';
    t.false(isFileUrl(specifier));
});

test('should return false for an HTTPS URL', t => {
    const specifier = 'https://example.com';
    t.false(isFileUrl(specifier));
});

test('should return false for an FTP URL', t => {
    const specifier = 'ftp://example.com/file.txt';
    t.false(isFileUrl(specifier));
});

test('should return false for a mailto URL', t => {
    const specifier = 'mailto:user@example.com';
    t.false(isFileUrl(specifier));
});

// Cadenas no válidas o que no son URLs:
test('should return false for an invalid URL string', t => {
    const specifier = 'not a url';
    t.false(isFileUrl(specifier));
});

test('should return false for an empty string', t => {
    const specifier = '';
    t.false(isFileUrl(specifier));
});

// Casos límite:
test('should return true for "file://" without a path', t => {
    const specifier = 'file://';
    t.true(isFileUrl(specifier));
});

test('should return true for "file:/relative/path"', t => {
    const specifier = 'file:/relative/path';
    t.true(isFileUrl(specifier));
});

test('should return false for a relative path without protocol', t => {
    const specifier = '/relative/path/to/file.txt';
    t.false(isFileUrl(specifier));
});

test('should return false for a Windows path without file protocol', t => {
    const specifier = 'C:\\path\\to\\file.txt';
    t.false(isFileUrl(specifier));
});
