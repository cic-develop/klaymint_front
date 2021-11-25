/**
 * includes : 경로 추가 시 해당 경로에 있는 모든 gql 함수 안의 query에 대한 interface를
 *  schema.json 으로 추가 함
 * service.url : 백앤드 서버 주소를 통해서 schema.json를 다운로드
 */

module.exports = {
    client: {
        includes: ['./src/**/*.{tsx,ts, jsx, js}'],
        tagName: 'gql',
        service: {
            name: 'rsteam-backend-cms',
            url: 'http://localhost:3000/graphql',
        },
    },
};
