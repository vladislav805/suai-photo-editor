import jest from 'jest';
import Connector from '../utils/connector';

describe('Connector', () => {
    it('should equal instance on getInstance', () => {
        const conn1 = Connector.getInstance();
        const conn2 = Connector.getInstance();

        expect(conn1).toStrictEqual(conn2);
    });

    it('should send and receive message', done => {
        Connector.getInstance().on('test', () => done());

        Connector.getInstance().fire('test');
    });

    it('should send and receive message with arguments', done => {
        const data = { a: 1, b: 'test' };
        Connector.getInstance().on('test', (args: { a: number, b: string }) => {
            expect(args).toEqual(data);
            done();
        });

        Connector.getInstance().fire('test', data);
    });
});
