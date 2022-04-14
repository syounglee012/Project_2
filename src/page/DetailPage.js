import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { actionCreators as commentsActions } from "../redux/modules/comment";
import { actionCreators as postActions } from "../redux/modules/post";
import CloseButton from "react-bootstrap/CloseButton";

const DetailPage = (props) => {
  const [comment, setComment] = useState("");
  const params = useParams();
  const dispatch = useDispatch();
  const token = sessionStorage.getItem("token");
  const post_list = useSelector((state) => state.post.list);
  const post = post_list.find((p) => p._id === params.postid);
  const comments_list = useSelector((state) => state.comment.comments);

  const parseToken = (token = null) => {
    try {
      return JSON.parse(atob(token.split(".")[1]));
    } catch (e) {
      return null;
    }
  };
  const checkLog = () => {
    if (token) {
      const current_id = parseToken(token);
      return current_id.userId;
    }
  };

  useEffect(() => {
    dispatch(commentsActions.getCommentsDB(post._id));
  }, []);

  const postComment = () => {
    dispatch(commentsActions.addCommentDB(token, comment, post._id));
    setComment("");
  };

  const onChange = (e) => {
    setComment(e.target.value);
  };

  const deletePost = () => {
    dispatch(postActions.deletePostDB(post._id));
  };

  const deleteComment = (Id) => {
    dispatch(commentsActions.deleteCommentDB(Id));
    console.log(Id);
  };

  return (
    <Main>
      <BigBox>
        <ImageRect src={post.imageUrl} />
        <Box>
          <NameTag>
            <ImageCircle src={post.userImageUrl} />
            <Text>{post.userId}</Text>

            <BtnGroup>
              <EDBtn>수정하기</EDBtn>
              <EDBtn onClick={deletePost}>삭제하기</EDBtn>
            </BtnGroup>
          </NameTag>
          <PosterBox>
            <Text>
              <div>{post.title}</div>

              <br />
              {post.content}
            </Text>
          </PosterBox>

          <Box1>
            {comments_list.map((comment) => (
              <SmallBox>
                <ImageCircle src={comment.userImageUrl} />
                <Text>{comment.userId}</Text>
                <Text> {comment.comment}</Text>
                <Text1> {comment.createAt}</Text1>
                {comment.userId == checkLog() ? (
                  <CloseButton onClick={() => deleteComment(comment._id)} />
                ) : null}
              </SmallBox>
            ))}
          </Box1>

          <SmallBox>
            <Input
              placeholder="Leave a comment here"
              value={comment}
              onChange={onChange}
            />

            <Button
              onClick={() => {
                postComment();
              }}
            >
              Submit
            </Button>
          </SmallBox>
        </Box>
      </BigBox>
    </Main>
  );
};

const NameTag = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
`;

const PosterBox = styled.div`
  display: flex;
  float: left;
  height: 150px;
`;

const Main = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  background-color: #fafafa;
  padding-top: 50px;
  height: 100%;
`;
const Button = styled.button`
  background: transparent;
  border-radius: 3px;
  border: 1px solid #394481;
  color: #394481;
  margin: 0 1em;
  padding: 0.6em 0.8em;
  border-radius: 50px;
  font-size: medium;
  cursor: pointer;
  &:hover {
    border: 3px solid #394481;
  }
`;

const SmallBox = styled.div`
  display: flex;
  justify-content: left;
  align-items: center;
  float: left;
`;

const BigBox = styled.div`
  margin: auto;
  display: flex;
  align-items: center;
`;
const Box = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  border: 1px solid #394481;
  padding: 0 1em;
  margin: 1em;
  width: 400px;
  height: 600px;
  border-radius: 30px;
`;

const Box1 = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 300px;
  overflow: auto;
  width: 350px;
  height: 300px;
`;

const ImageRect = styled.div`
  border-radius: 30px;
  display: flex;
  width: 500px;
  min-width: 50px;
  height: 600px;
  background-image: url(${(props) => props.src});
  background-size: cover;
`;

const ImageCircle = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50px;
  background-image: url(${(props) => props.src});
  background-size: cover;
  margin: 3px;
`;
const Input = styled.input`
  border: 1px solid #394481;
  width: 100%;
  padding: 12px 4px;
  box-sizing: border-box;
  border-radius: 10px;
`;
const Text = styled.div`
  color: "#222831";
  font-size: 15px;
  padding: 0 4px;
`;
const Text1 = styled.div`
  color: "#222831";
  font-size: 11px;
  justify-content: right;
`;

const EDBtn = styled.button`
  padding: 5px;
  margin-left: 10px;
`;
const BtnGroup = styled.div`
  padding: 16px;
  margin-left: 65px;
`;
export default DetailPage;
