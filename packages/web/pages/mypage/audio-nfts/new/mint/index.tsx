import { NextPage } from 'next';
import { useSignMessage } from 'wagmi';

const Test: NextPage = () => {
  const { data, error, isLoading, signMessage } = useSignMessage({
    onSuccess(data, variables) {
      console.log(data);
      console.log(variables);
    },
  });

  const handleClick = () => {
    fetch('/api/audio-nfts/new/mint/test', {
      method: 'GET',
    })
      .then((res) => res.json())
      .then((json) => {
        console.log('HOGE');
        signMessage(json);
      });
  };
  return <button onClick={handleClick}>aiueo</button>;
};
export default Test;
