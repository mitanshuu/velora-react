import { useEffect, useState, useCallback } from "react";
import BaseTable from "../Components/Base/Table";
import BaseButton from "../Components/Base/Button";
import BaseDialog from "../Components/Base/Dialog";
import BaseInput from "../Components/Base/Input";
import {
  addCategory,
  listOfCategories,
  updateCategory,
  fileUpload,
  deleteCategory,
  viewCategory,
} from "../Api/Category";
import { useFormik } from "formik";
import { showErrorToast, showSuccessToast } from "../utils/toastService";
import {
  errorHandler,
  getPlaceholder,
  handleImageError,
  commonFileUpload,
} from "../utils/common";
import { categoryValidationSchema } from "../utils/validationSchema";
import { commonLabel } from "../utils/label";
import DialogFooter from "../Components/DialogFooter";
import { BASE_FILE_URL } from "../Api/apiService";
import defaultImage from "../assets/images/nope-not-here.avif";

const Category = () => {
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [addEditLoading, setAddEditLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [tableParams, setTableParams] = useState({
    page: 1,
    pageSize: 10,
    sortKey: "id",
    sortValue: "desc",
    search: "",
  });
  const [totalRecords, setTotalRecords] = useState(0);

  const formik = useFormik({
    initialValues: {
      id: null,
      name: "",
      description: "",
      image: null,
      preview: null,
    },
    validationSchema: categoryValidationSchema,
    onSubmit: async (values) => {
      await handleAddCategory(values);
    },
  });

  const resetForm = () => {
    formik.resetForm();
  };

  const onImageError = (event) => {
    handleImageError(event, defaultImage);
  };

  const columns = [
    {
      field: "image",
      header: commonLabel.image,
      body: (rowData) => (
        <div className="">
          <div className="relative group p-1 w-fit bg-white rounded-2xl shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md hover:border-blue-100 overflow-hidden">
            <img
              src={
                rowData.category_image
                  ? `${BASE_FILE_URL}${rowData.category_image}`
                  : defaultImage
              }
              alt={rowData.category_name}
              className="w-12 h-12 object-cover rounded-xl transform transition-transform duration-500 group-hover:scale-110"
              onError={onImageError}
            />
            <div className="absolute inset-0 bg-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
        </div>
      ),
    },
    {
      field: "category_name",
      header: commonLabel.name,
      body: (rowData) => (
        <span className="font-bold text-gray-800 tracking-tight group-hover:text-blue-600 transition-colors">
          {rowData.category_name}
        </span>
      ),
      sortable: true,
    },
    {
      field: "description",
      header: commonLabel.description,
      body: (rowData) => (
        <p className="text-gray-500 text-sm line-clamp-2 leading-relaxed">
          {rowData.description || "-"}
        </p>
      ),
    },
  ];

  const fetchCatgories = useCallback(async () => {
    try {
      setLoading(true);

      const payload = {
        pageSize: tableParams.pageSize,
        page: tableParams.page,
        sortKey: tableParams.sortKey,
        sortValue: tableParams.sortValue,
        search: tableParams.search,
      };

      const response = await listOfCategories(payload);
      if (response?.success) {
        setCategories(response.data?.categories || []);
        setTotalRecords(response.data?.totalItems || 0);
      }
    } catch (error) {
      errorHandler(error);
    } finally {
      setLoading(false);
    }
  }, [
    tableParams.page,
    tableParams.pageSize,
    tableParams.sortKey,
    tableParams.sortValue,
    tableParams.search,
  ]);

  const handleAddCategory = async (values) => {
    setAddEditLoading(true);
    try {
      const payload = {
        category_name: values.name,
        description: values.description,
        category_image: values.image,
      };

      const response = values.id
        ? await updateCategory(values.id, payload)
        : await addCategory(payload);

      if (response?.success) {
        showSuccessToast(response.message);
        setVisible(false);
        fetchCatgories();
        resetForm();
      } else {
        showErrorToast(response?.message);
      }
    } catch (error) {
      errorHandler(error);
    } finally {
      setAddEditLoading(false);
    }
  };

  useEffect(() => {
    fetchCatgories();
  }, [fetchCatgories]);

  const onPage = (event) => {
    const newPage = event.page + 1;
    const newPageSize = event.rows;
    if (newPage !== tableParams.page || newPageSize !== tableParams.pageSize) {
      setTableParams((prev) => ({
        ...prev,
        page: newPage,
        pageSize: newPageSize,
      }));
    }
  };

  const onSort = (event) => {
    const newSortKey = event.sortField || "id";
    const newSortValue = event.sortOrder === 1 ? "asc" : "desc";
    if (
      newSortKey !== tableParams.sortKey ||
      newSortValue !== tableParams.sortValue
    ) {
      setTableParams((prev) => ({
        ...prev,
        sortKey: newSortKey,
        sortValue: newSortValue,
      }));
    }
  };

  const onSearch = (value) => {
    if (value !== tableParams.search) {
      setTableParams((prev) => ({
        ...prev,
        search: value,
        page: 1,
      }));
    }
  };

  const handleEdit = async (rowData) => {
    try {
      setIsEdit(true);
      setLoading(true);
      const response = await viewCategory(rowData.id);
      if (response?.success) {
        const data = response.data;
        formik.setValues({
          id: data.id,
          name: data.category_name,
          description: data.description || "",
          image: data.category_image,
          preview: data.category_image
            ? `${BASE_FILE_URL}${data.category_image}`
            : null,
        });
        setVisible(true);
      } else {
        showErrorToast(response?.message);
      }
    } catch (error) {
      errorHandler(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (rowData) => {
    setSelectedCategory(rowData);
    setDeleteDialogVisible(true);
  };

  const confirmDelete = async () => {
    setDeleteLoading(true);
    try {
      const response = await deleteCategory(selectedCategory.id);
      if (response?.success) {
        showSuccessToast(response.message);
        setDeleteDialogVisible(false);
        fetchCatgories();
      } else {
        showErrorToast(response?.message);
      }
    } catch (error) {
      errorHandler(error);
    } finally {
      setDeleteLoading(false);
    }
  };

  const onHide = () => {
    if (!addEditLoading) setVisible(false);
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const localPreview = URL.createObjectURL(file);
      formik.setFieldValue("preview", localPreview);

      await commonFileUpload(
        file,
        fileUpload,
        "files",
        setImageLoading,
        (uploadedFileName) => {
          formik.setFieldValue("image", uploadedFileName);
        },
        () => {
          formik.setFieldValue("preview", null);
        },
      );
    }
  };

  const handleAdd = () => {
    setIsEdit(false);
    resetForm();
    setVisible(true);
  };

  return (
    <>
      <div className="p-4 md:p-6 lg:p-8 max-w-(--breakpoint-2xl) mx-auto animate-in fade-in duration-700">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 px-2">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-3 py-1 bg-blue-100 text-blue-700 text-[10px] font-black rounded-full uppercase tracking-widest">
                {commonLabel.catalogManagement}
              </span>
            </div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">
              {commonLabel.productCategories}
            </h1>
            <p className="text-gray-400 text-sm font-semibold mt-1 flex items-center gap-2">
              {commonLabel.manageText}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <BaseButton
              label={commonLabel.addCategory}
              icon="pi pi-plus"
              className="w-auto! bg-blue-600 border-none shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all duration-300 px-6 py-3 rounded-2xl text-sm font-bold text-white hover:scale-105 transform active:scale-95"
              disabled={loading || addEditLoading}
              onClick={handleAdd}
            />
          </div>
        </div>

        <div className="shadow-2xl shadow-gray-200/50 ">
          <BaseTable
            data={categories}
            columns={columns}
            loading={loading}
            showActions={true}
            totalRecords={totalRecords}
            first={(tableParams.page - 1) * tableParams.pageSize}
            rows={tableParams.pageSize}
            sortField={tableParams.sortKey}
            sortOrder={tableParams.sortValue === "asc" ? 1 : -1}
            onPage={onPage}
            onSort={onSort}
            onSearch={onSearch}
            onEdit={handleEdit}
            onDelete={handleDelete}
            scrollHeight="calc(100vh - 350px)"
            tableClassName="category-table"
            title={commonLabel.categoryList}
          />
        </div>
      </div>

      <BaseDialog
        visible={visible}
        header={
          <div className="flex items-center gap-3">
            <div>
              <h2 className="text-xl font-black text-gray-900 tracking-tight">
                {isEdit ? commonLabel.updateCategory : commonLabel.addCategory}
              </h2>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                {commonLabel.categoryDetails}
              </p>
            </div>
          </div>
        }
        closable={!addEditLoading}
        onHide={onHide}
        footer={
          <DialogFooter
            onHide={onHide}
            handleSave={formik.handleSubmit}
            loading={addEditLoading}
            buttonLabel={
              isEdit ? commonLabel.updateCategory : commonLabel.addCategory
            }
            disabled={addEditLoading}
          />
        }
        className="category-dialog"
      >
        <form onSubmit={formik.handleSubmit}>
          <div className="flex flex-col gap-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-4">
                <BaseInput
                  label={commonLabel.categoryName}
                  name="name"
                  placeholder={getPlaceholder(commonLabel.categoryName)}
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  required
                  error={formik.touched.name && !!formik.errors.name}
                  errormessage={formik.touched.name && formik.errors.name}
                />

                <BaseInput
                  label={commonLabel.categoryDescription}
                  name="description"
                  type="textarea"
                  placeholder={getPlaceholder(commonLabel.categoryDescription)}
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  rows={5}
                />
              </div>

              <div className="flex flex-col gap-3">
                <label className="text-sm font-semibold text-gray-700">
                  {commonLabel.categoryImage}
                </label>
                <div
                  className="relative group/img h-[215px] rounded-3xl border-2 border-dashed border-gray-200 hover:border-blue-400 hover:bg-blue-50/30 transition-all flex flex-col items-center justify-center gap-3 cursor-pointer overflow-hidden p-2"
                  onClick={() =>
                    !imageLoading &&
                    document.getElementById("category-image").click()
                  }
                >
                  <input
                    type="file"
                    id="category-image"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  {formik.values.preview ? (
                    <>
                      <img
                        src={formik.values.preview}
                        className={`w-full h-full object-cover rounded-2xl ${imageLoading ? "opacity-50" : ""}`}
                        alt="Preview"
                        onError={onImageError}
                      />
                      {imageLoading && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <i className="pi pi-spin pi-spinner text-3xl text-blue-600"></i>
                        </div>
                      )}
                      {!imageLoading && (
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                          <div className="flex gap-2">
                            <div className="bg-white/20 backdrop-blur-md p-2 rounded-xl text-white hover:bg-white/40 transition-colors">
                              <i className="pi pi-refresh"></i>
                            </div>
                            <div
                              className="bg-red-500/80 backdrop-blur-md p-2 rounded-xl text-white hover:bg-red-600 transition-colors"
                              onClick={(e) => {
                                e.stopPropagation();
                                formik.setFieldValue("image", null);
                                formik.setFieldValue("preview", null);
                              }}
                            >
                              <i className="pi pi-trash"></i>
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      <div className="w-14 h-14 rounded-2xl bg-gray-50 text-gray-400 flex items-center justify-center group-hover/img:bg-blue-100 group-hover/img:text-blue-500 transition-all">
                        {imageLoading ? (
                          <i className="pi pi-spin pi-spinner text-2xl"></i>
                        ) : (
                          <i className="pi pi-image text-2xl"></i>
                        )}
                      </div>
                      <div className="text-center px-4">
                        <p className="text-sm font-bold text-gray-700">
                          {imageLoading
                            ? commonLabel.uploading
                            : commonLabel.uploadImage}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {commonLabel.pngJpgUpTo2MB}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </form>
      </BaseDialog>

      <BaseDialog
        visible={deleteDialogVisible}
        onHide={() => !loading && setDeleteDialogVisible(false)}
        header={
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-red-50 flex items-center justify-center text-red-600">
              <i className="pi pi-exclamation-triangle font-bold"></i>
            </div>
            <h2 className="text-xl font-black text-gray-900 tracking-tight">
              {commonLabel.deleteCategory}
            </h2>
          </div>
        }
        footer={
          <DialogFooter
            onHide={() => setDeleteDialogVisible(false)}
            handleSave={confirmDelete}
            loading={deleteLoading}
            buttonLabel={commonLabel.delete}
          />
        }
        className="delete-dialog"
      >
        <div>
          <p className="text-gray-600 font-medium">
            {commonLabel.deleteCategoryMsg}{" "}
            <span className="font-semibold text-gray-900">
              &quot;{selectedCategory?.category_name || selectedCategory?.name}
              &quot;?
            </span>
          </p>
        </div>
      </BaseDialog>
    </>
  );
};

export default Category;
