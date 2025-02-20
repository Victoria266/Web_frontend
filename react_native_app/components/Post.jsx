import styled from "styled-components/native";
import {Text, Button} from "react-native";

const Post = ({navigation, id, name, item}) => {

    const image = `http://${process.env.IP_ADDRESS}:8000/api/resources/${item.id}/image/`

    const handlePress = () => {
        navigation.navigate("FullPost", {id: id, name: name });
    };

    return (
        <PostView>
            <PostDetails>
                <PostImage source={{uri: image}} />
                <PostRightDetails>
                    <PostTitleContainer>
                        <PostTitle>{name}</PostTitle>
                    </PostTitleContainer>
                    <PostDetails>
                        <Text>
                            Плотность: {item.density} г/см³
                        </Text>
                    </PostDetails>
                    <PostButton>
                        <Button title='Открыть' onPress={handlePress} color="#007EB0" />
                    </PostButton>
                </PostRightDetails>
            </PostDetails>
        </PostView>
    )
}


const PostView = styled.View`
  flex-direction: column;
  gap: 15px;
  padding: 15px;
  margin: 15px;
  border-width: 1px;
  border-color: rgba(0, 0, 0, 0.1);
  border-style: solid;
  border-radius: 5px;
`

const PostImage = styled.Image`
  width: 60px;
  height: 60px;
  border-radius: 12px;
  margin-right: 12px;
`

const PostTitleContainer = styled.Text`
  flex: 1;
  align-items: center;
  justify-content: center;
`

const PostTitle = styled.Text`
  font-size: 18px;
  font-weight: 700;
`

const PostDetails = styled.View`
  flex-direction: row;
`
const PostRightDetails = styled.View`
  flex-direction: column;
  flex: 1;
  gap: 20px;
`

const PostButton = styled.View`
  flex: 1;
  justify-content: center;
  align-content: center;
`

export default Post;