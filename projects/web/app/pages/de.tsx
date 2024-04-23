import { GetServerSideProps } from 'next';

export const getServerSideProps: GetServerSideProps = async () => {
    return { redirect: { permanent: false, destination: '/' } };
};

export default function Page() {
    return <></>;
}
