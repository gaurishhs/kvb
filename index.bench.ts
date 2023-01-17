import { run, bench, group, baseline } from 'mitata';
import { KVBase } from '.';

group('KVBase', () => {
    let db = new KVBase();
    baseline('set', () => {
        db.set('test', 'test');
    });
    
    bench('get (first)', () => {
        db.get('test', true);
    });
    
    bench('get (all)', () => {
        db.get('test');
    });
    
    bench('delete', () => {
        db.delete('test');
    });
    
    bench('update', () => {
        db.update('test', 'test2');
    });

    bench('set (schema)', () => {
        let db = new KVBase({
            schema: {
                test: { type: 'string' },
            },
        });
        db.set('test', { test: 'test' });
    })
});

run();